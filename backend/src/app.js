'use strict';

/** Importing modules **/
const fs = require('fs');
const path = require('path');

const passport = require('passport');
const passportSaml = require('passport-saml');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');

/** Initialize all cron jobs **/
const CronTasksService = require('./services/CronTasksService');
CronTasksService.init();

/** init express and set up the middlewares **/
const app = express()
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.json())
    .use(express.static('public'));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

/** Set up and enable sessions **/
app.use(
    session({
        secret: "session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: { _expires: 60000000, maxAge: 60000000 },
    })
);

/** Set up and enable passport **/
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new passportSaml.Strategy(
        {
            path: '/sso/callback',
            entryPoint: 'https://thesis-management-09.eu.auth0.com/samlp/JbUVcU90I7wK6nuQXaVty41vHEBHC8cF',
            issuer: 'urn:thesis-management-09.eu.auth0.com',
            callbackUrl: 'http://localhost:3000/sso/callback',
            logoutUrl:
                "https://thesis-management-09.eu.auth0.com/samlp/JbUVcU90I7wK6nuQXaVty41vHEBHC8cF/logout",
            cert: fs.readFileSync(path.join(__dirname, '..', 'thesis-management-09.pem'), 'utf8'),
            signatureAlgorithm: 'sha256',
            acceptedClockSkewMs: 5000, // 5 seconds
            disableRequestedAuthnContext: true,
            identifierFormat: null, // Use default identifier format
        },
        function (profile, done) {
            profile.id = profile['http://schemas.auth0.com/nickname'];
            profile.name = profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

            const roles = profile["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            if (Array.isArray(roles)) {
                profile.roles = roles;
            } else if (typeof roles === 'string') {
                profile.roles = [roles];
            } else {
                profile.roles = [];
            }

            done(null, profile);
        }
    )
);

app.use(passport.initialize());
app.use(passport.session());



/** APIs **/
// Don't add /api prefix to the following router since some of its endpoints doesn't contain it
app.use('', require('./routers/authentication'));

app.use('/api', require('./routers/thesis-proposals') );
app.use('/api', require('./routers/utils'));
app.use('/api/student', require('./routers/student'));
app.use('/api/teacher', require('./routers/teacher'));
app.use('/api/secretary-clerk', require('./routers/secretary-clerk'));
app.use('/api/system/virtual-clock', require('./routers/virtual-clock'));

/** Error handling **/
app.use( require('./middlewares/errors').errorHandler );

module.exports = { app };

/**
 * @typedef {import('express').Request} PopulatedRequest
 *
 * @property {DeserializedUser} user
 * @property {(() => boolean)} isAuthenticated
 */

/**
 * @typedef {object} DeserializedUser
 *
 * @property {string} id
 * @property {string} name
 * @property {USER_ROLES[]} roles
 */
