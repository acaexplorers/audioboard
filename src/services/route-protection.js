// Route protection means that certain pages are restricted for users that are not logged in
module.exports.BasicRouteProtector = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

module.exports.AdminRouteProtector = (req, res, next) => {
    if (req.session.loggedIn && req.session.admin) {
        return next();
    } else {
        return res.redirect('/queue');
    }
}

module.exports.NotLoggedInProtector = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect('/queue');
    }
}
