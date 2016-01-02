'use strict';

exports = module.exports = function(app, db) {
    var AdminGroup = new db.Schema({
	table: "admingroup",
	fields: {
	    id: { type: Number, key: true, auto: true },
	    guid: { type: String, length: 36, on_insert: true, default: db.uuid },	    
	    name: { type: String, default: '' },
	    permissions: { type: Array, parser: JSON },
	    created: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_insert: true },
	    modified: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_update: true, nullable: true }
	}
    });
    AdminGroup.hasMany("Account", { as: "Accounts", field: "groups" });
};
