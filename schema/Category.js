'use strict';

exports = module.exports = function(app, db) {
    var Category = new db.Schema('Category', {
	table: "category",
	fields: {
	    id: { type: Number, key: true, auto: true },
	    pivot: { type: String, default: '' },
	    name: { type: String, default: '' },
	    created: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_insert: true }
	}
    });
};
