const SessionService = require('../services/session');

module.exports = class LoginController {

    constructor(userModel) {
        this.user = userModel;
    }

    async get(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        if (template.loggedIn) {
            req.session.destroy();
            res.render('logout');
        } else {
            res.redirect('/login');
        }
    }
}
