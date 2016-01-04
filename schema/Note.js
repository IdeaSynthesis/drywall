'use strict';

exports = module.exports = function(app, db) {
    var Note = db.Schema('Note', {
	table: "note",
	fields: {
	    id: { type: Number, key: true, auto: true },
	    guid: { type: String, length: 36, on_insert: true, default: db.uuid },
	    Account: { type: Number, column: 'account_id' },
	    data: { type: String, default: '' },
	    created: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_insert: true },
	    modified: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_update: true, nullable: true }
	}
    });
    Note.belongsTo('Account', { field: "Account" });
};
