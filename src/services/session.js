const Database = require('../logic/database');

module.exports = class SessionService {

    constructor() { }

    static viewParamsTemplate(session) {
        return {
            userId: session.userId,
            username: session.username,
            loggedIn: session.loggedIn,
            admin: session.admin,
        };
    }

}
