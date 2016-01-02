'use strict';

exports = module.exports = function(app, db) {
    var LoginAttempt = new db.Schema('LoginAttempt', {
	table: 'loginAttempt',
	fields: {
	    id: { type: Number, key: true, auto: true },
	    ip: { type: String, default: '' },
	    Account: { type: Number, column: account_id },
	    time: { type: Date, default: db.literal("CURRENT_TIMESTAMP")  }
	}
    });
    LoginAttempt.belongsTo('Account', { field: "Account" });
    LoginAttempt.flushAfter(app.config.loginAttempts.logExpiration);
};
