'use strict';

exports = module.exports = function(app, db) {
    var Verification = db.Schema('Auth', {
	table: "verification",
	fields: {
	    id: { type: Number, key: true, auto: true },
	    guid: { type: String, length: 36, on_insert: true, default: db.uuid },
	    Auth: { type: Number, column: 'auth_id' },
	    created: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_insert: true },
	    verified: { type: Date, nullable: true },
	    sent: { type: Date, nullable: true }
	}});
    Verification.belongsTo('Auth', { field: "Auth" });
};
