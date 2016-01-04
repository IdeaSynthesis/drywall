'use strict';

exports = module.exports = function(app, passport) {
    var LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    TumblrStrategy = require('passport-tumblr').Strategy;

    passport.use(new LocalStrategy(
	function(username, password, done) {
	    var conditions = { isActive: 'yes' };
	    if (username.indexOf('@') === -1) {
		conditions.username = username;
	    }
	    else {
		conditions.email = username.toLowerCase();
	    }

	    app.db.models.User.findOne(conditions, function(err, user) {
		if (err) {
		    return done(err);
		}

		if (!user) {
		    return done(null, false, { message: 'Unknown user' });
		}

		app.db.models.User.validatePassword(password, user.password, function(err, isValid) {
		    if (err) {
			return done(err);
		    }

		    if (!isValid) {
			return done(null, false, { message: 'Invalid password' });
		    }

		    return done(null, user);
		});
	    });
	}
    ));

    if ('CLIENT_ID_TWITTER' in process.env) {
	passport.use(new TwitterStrategy({
            consumerKey: process.env.CLIENT_ID_TWITTER,
            consumerSecret: process.env.CLIENT_SECRET_TWITTER
	}, function(token, tokenSecret, profile, done) {
	    done(null, false, {
		token: token,
		tokenSecret: tokenSecret,
		profile: profile
	    });
	}));
    }
    
    if ('CLIENT_ID_GITHUB' in process.env){
	passport.use(new GitHubStrategy({
            clientID: process.env.CLIENT_ID_GITHUB,
            clientSecret: process.env.CLIENT_SECRET_GITHUB,
            customHeaders: { "User-Agent": process.env.PROJECT_NAME+" ("+process.env.COMPANY_NAME+")" }
	}, function(accessToken, refreshToken, profile, done) {
	    done(null, false, {
		accessToken: accessToken,
		refreshToken: refreshToken,
		profile: profile
	    });
	}));
    }

    if ('CLIENT_ID_FACEBOOK' in process.env) {
	passport.use(new FacebookStrategy({
            clientID: process.env.CLIENT_ID_FACEBOOK,
            clientSecret: process.env.CLIENT_SECRET_FACEBOOK
	}, function(accessToken, refreshToken, profile, done) {
	    done(null, false, {
		accessToken: accessToken,
		refreshToken: refreshToken,
						  profile: profile
	    });
	}));
    }
    
    if ('CLIENT_ID_GOOGLE' in process.env) {
	passport.use(new GoogleStrategy({
            clientID: process.env.CLIENT_ID_GOOGLE,
            clientSecret: process.env.CLIENT_SECRET_GOOGLE
	}, function(accessToken, refreshToken, profile, done) {
	    done(null, false, {
		accessToken: accessToken,
		refreshToken: refreshToken,
		profile: profile
	    });
	}));
    }

    if ('CLIENT_ID_TUMBLR' in process.env) {
	passport.use(new TumblrStrategy({
            consumerKey: process.env.CLIENT_ID_TUMBLR,
            consumerSecret: process.env.CLIENT_SECRET_TUMBLR
	}, function(token, tokenSecret, profile, done) {
	    done(null, false, {
		token: token,
		tokenSecret: tokenSecret,
		profile: profile
	    });
	}));
    }

    passport.serializeUser(function(user, done) {
	done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
	app.db.models.User.findOne({ _id: id }).populate('roles.admin').populate('roles.account').exec(function(err, user) {
	    if (user && user.roles && user.roles.admin) {
		user.roles.admin.populate("groups", function(err, admin) {
		    done(err, user);
		});
	    }
	    else {
		done(err, user);
	    }
	});
    });
};
