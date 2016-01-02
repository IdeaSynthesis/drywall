"use strict";

var hstore = require('pg-hstore')();
var uuid = require('node-uuid');
var Promise = require('bluebird');

function Literal(value)
{
    this.value = value;
}

function Schema(name, definition)
{
    var self = this;
    this.name = name;
    this.definition = definition;

    return self;
}

Schema.prototype.create = function(fields)
{

}

function ORM(db)
{
    this.db = db;
}

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

ORM.models = {};

ORM.prototype.model = function(key)
{
    return ORM.models[key];
}

ORM.prototype.Schema = Schema;

module.exports = ORM;
