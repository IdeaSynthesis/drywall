'use strict';

exports = module.exports = function(app, db) {
    var Auth = db.Schema('Auth', {
	table: "auth",
	fields: {
	    id: { type: Number, key: true, auto: true },
	    guid: { type: String, length: 36, on_insert: true, default: db.uuid },
	    Account: { type: Number, column: 'account_id' },
	    email: { type: String, length: 64 },
	    password: { type: String, length: 1280, transform: 'encryptPassword', nullable: true },
	    created: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_insert: true },
	    modified: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_update: true, nullable: true },
	    lastlogin: { type: Date, nullable: true },
	    active: { type: Boolean, default: true },
	    details: { type: Object, parser: db.hstore(), nullable: true },
	    refid: { type: String, length: 128, nullable: true },
	    provider: { type: String, length: 16 },
	    resetguid: { type: String, length: 36, nullable: true },
	    newemail: { type: String, length: 64, nullable: true },
	    newemailguid: { type: String, length: 36, nullable: true }
	}});
    Auth.belongsTo('Account', { field: "Account" });
    Auth.statics.encryptPassword = function(password, done) {
	var bcrypt = require('bcrypt');
	bcrypt.genSalt(10, function(err, salt) {
	    if (err) {
		return done(err);
	    }
	    
	    bcrypt.hash(password, salt, function(err, hash) {
		done(err, hash);
	    });
	});
    };
    Auth.statics.validatePassword = function(password, hash, done) {
	var bcrypt = require('bcrypt');
	bcrypt.compare(password, hash, function(err, res) {
	    done(err, res);
	});
    };
};
