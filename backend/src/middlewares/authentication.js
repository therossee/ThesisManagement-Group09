const passport = require("passport");

const authenticate = passport.authenticate("saml", { failureRedirect: "/", failureFlash: true });

module.exports = {
    authenticate
};
