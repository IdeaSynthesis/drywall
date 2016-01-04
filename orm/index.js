"use strict";

var hstore = require('pg-hstore')();
var uuid = require('node-uuid');
var Promise = require('bluebird');
var util = require('util');
var events = require('events');

function Literal(value)
{
    this.value = value;
    return this;
}

function Model(schema, fields, options)
{
    this.schema = schema;
    this.fields = fields;
    this.options = options;
    this.dirty = {};
    return this;
};
util.inherits(Model, events.EventEmitter);

Model.prototype.get = function(field)
{
    return this.fields[field];
};

Model.prototype.set = function(field, value)
{
    if(!(field in this.fields) || this.fields[field] != value){
	this.dirty[field] = value;
    }
};

function Schema(name, definition)
{
    var self = this;
    this.name = name;
    this.definition = definition;
    this.key = null;
    
    var k, defn;
    for(k in definition.fields){
	defn = definition.fields[k];
	if('key' in defn && defn.key == true) this.key = { "name": k, "def": defn};
    }
    return self;
}
util.inherits(Schema, events.EventEmitter);

Schema.prototype.hasMany = function(name, settings)
{

}

Schema.prototype.belongsTo = function(name, settings)
{

}

Schema.prototype.belongsToMany = function(name, settings)
{

}

Schema.prototype.methods = {};

Schema.prototype.statics = {};

Schema.prototype.create = function(fields)
{
    var self = this;
    return new Promise(function(resolve, reject){
	var dbcols = [], dbparams = [], dbvals = [], k, defn, val, targetfields = {}, inserts = [];
	inserts.push('column' in self.key.def ? self.key.def.column+" AS "+self.key.name : self.key.name);
	for(k in self.definition.fields){
	    defn = self.definition.fields[k];
	    if(k in fields){
		dbcols.push('column' in defn ? defn['column'] : k);
		val = fields[k];
		if(val instanceof Literal){
		    dbparams.push(val.value);
		    inserts.push(dbcols[dbcols.length-1] +" AS "+k);
		}else if(typeof val == 'function'){
		    dbvals.push(val());
		    dbparams.push("$"+(dbvals.length));
		    targetfields[k] = dbvals[dbvals.length-1];
		}else{
		    dbvals.push(val);
		    dbparams.push("$"+(dbvals.length));
		    targetfields[k] = dbvals[dbvals.length-1];
		}
	    }else{
		if('default' in defn){
		    dbcols.push('column' in defn ? defn['column'] : k);
		    if(defn.default instanceof Literal){
			dbparams.push(defn.default.value);
			inserts.push(dbcols[dbcols.length-1] +" AS "+k);
		    }else if(typeof defn.default == 'function'){
			dbvals.push(defn.default());
			dbparams.push("$"+(dbvals.length));
			targetfields[k] = dbvals[dbvals.length-1];
		    }else{
			dbvals.push(defn.default);
			dbparams.push("$"+(dbvals.length));
			targetfields[k] = dbvals[dbvals.length-1];
		    }
		}else if('nullable' in defn || ('auto' in defn && defn.auto == true)){
		    // do nothing
		}else{
		    reject(k+" is required.");
		    return;
		}
	    }
	}
	
	self.orm.db.tx(function(t){
	    console.log("INSERT INTO "+self.definition.table+" ("+dbcols.join(", ")+") VALUES ("+dbparams.join(", ")+") RETURNING "+inserts.join(", "), dbvals);
	    return t.one("INSERT INTO "+self.definition.table+" ("+dbcols.join(", ")+") VALUES ("+dbparams.join(", ")+") RETURNING "+inserts.join(", "), dbvals);
	}).then(function(resp){
	    for(var f in resp) targetfields[f] = resp[f];
	    var ret = new Model(self, targetfields, {});
	    resolve(ret);
	}).catch(function(err){
	    reject(err);
	});
    });
}

function ORM(db)
{
    if(!(this instanceof ORM)) return new ORM(db);
    this.id = uuid.v4();
    this.db = db;
    this.models = {};
    return this;
}
util.inherits(ORM, events.EventEmitter);

ORM.prototype.literal = function(value)
{
    return new Literal(value);
}

ORM.prototype.hstore = function()
{
    return hstore;
}

ORM.prototype.uuid = function()
{
    return uuid.v4();
};

ORM.prototype.models;

ORM.prototype.Schema = function(name, settings)
{
    var self = this;
    var ret = new Schema(name, settings);
    ret.orm = self;
    self.models[name] = ret;
    return ret;
}

module.exports = ORM;
