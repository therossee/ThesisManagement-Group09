/**
 * @param {PopulatedRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getUserInformation(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            res.status(200).json(req.user);
        } else {
            res.status(401).json('Unauthorized');
        }
    } catch (e) {
        next(e);
    }
}

async function initiateLogin(req, res, next) {
    try {
        res.redirect("http://localhost:5173");
    } catch (e) {
        next(e);
    }
}

async function logout(req, res, next) {
    try {
        res.clearCookie("connect.sid");
        req.logout(function () {
            req.session.destroy(function () {
                res.send();
            });
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getUserInformation,
    initiateLogin,
    logout
};
