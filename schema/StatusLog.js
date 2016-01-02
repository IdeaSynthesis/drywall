'use strict';

exports = module.exports = function(app, db){
    var StatusLog = new db.Schema('StatusLog', {
	table: "status_log",
	fields: {
	    id: { type: Number, key: true, auto: true },
	    Status: { type: Number, column: status_id },
	    Account: { type: Number, column: account_id },
	    name: { type: String, default: '' },
	    created: { type: Date, default: db.literal("CURRENT_TIMESTAMP"), on_insert: true }
	}
    });
    StatusLog.belongsTo('Status', { field: "Status" });
    StatusLog.belongsTo('Account', { field: "Account" });
};
