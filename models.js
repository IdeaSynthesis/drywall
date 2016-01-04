'use strict';

exports = module.exports = function(app, db) {
    // regular documentation
    require('./schema/Account')(app, db);
    require('./schema/Auth')(app, db);
    require('./schema/Verification')(app, db);
    require('./schema/AdminGroup')(app, db);
    require('./schema/LoginAttempt')(app, db);
    
    // then the specialized bits
    require('./schema/Note')(app, db);
    require('./schema/Status')(app, db);
    require('./schema/StatusLog')(app, db);
    require('./schema/Category')(app, db);    
};
