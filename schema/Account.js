'use strict';

exports = module.exports = function(app, db) {
    var Account = db.Schema('Account', {
	table: "account",
	fields: {
	    id: { type: Number, key: true, auto: true },
	    guid: { type: String, length: 36, on_insert: true, default: db.uuid },
	    email: { type: String, length: 64, column: 'displayemail' },
	    name: { type: String, length: 64, column: 'displayname' },
	    alias: { type: String, length: 32 },
	    created: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_insert: true },
	    modified: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_update: true, nullable: true },
	    lastlogin: { type: Date, nullable: true },
	    active: { type: Boolean, default: true },
	    details: { type: Object, parser: db.hstore() },
	    info: { type: Object, parser: db.hstore() },
	    roles: { type: Array, parser: String },
	    groups: { type: Array, parser: Number }
	}});
    
    Account.hasMany("Auth", { as: "Auths", field: "Account" });
    
    Account.belongsToMany('AdminGroup', { as: "Groups", field: "groups" });
    
    Account.methods.canPlayRoleOf = function(role) 
    {
	if (this.roles && this.roles.indexOf(role) >= 0) return true;
	return false;
    };
    
    Account.methods.defaultReturnUrl = function() {
	return "/";
    };
};
