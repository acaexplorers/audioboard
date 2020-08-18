const SessionService = require('../services/session');
const User = require('../models/user');

module.exports = class LoginController {

    constructor(userModel) {
        this.user = userModel;
    }

    async get(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        res.render('login', {
            ...template,
        });
    }

    async post(req, res) {
        const {username, password} = req.body;
        const credentialsProcess = (await this.user.checkCredentials(username, password));
        if (credentialsProcess[0]) {
            const user = credentialsProcess[1];
            req.session.username = user.name;
            req.session.userId = user.id;
            req.session.loggedIn = true;
            req.session.admin = user.admin;
            res.redirect('/queue');
        } else {
            res.redirect('/login');
        }
    }
}
