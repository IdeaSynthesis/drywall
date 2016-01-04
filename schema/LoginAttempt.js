'use strict';

exports = module.exports = function(app, db) {
    var LoginAttempt = db.Schema('LoginAttempt', {
	table: 'login_attempt',
	fields: {
	    id: { type: Number, key: true, auto: true },
	    ip: { type: String, default: '' },
	    Auth: { type: Number, column: 'auth_id' },
	    attempted: { type: Date, default: db.literal("CURRENT_TIMESTAMP")  }
	}
    });
    LoginAttempt.belongsTo('Auth', { field: "Auth" });
    if('LOG_EXPIRATION' in process.env) LoginAttempt.flushAfter(parseInt(process.env.LOG_EXPIRATION));
};
