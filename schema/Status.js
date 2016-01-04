'use strict';

exports = module.exports = function(app, db) {
    var Status = db.Schema("Status", {
	table: "status",
	fields: {
	    id: { type: Number, key: true, auto: true },
	    pivot: { type: String, default: '' },
	    name: { type: String, default: '' }
	}
    });
};
