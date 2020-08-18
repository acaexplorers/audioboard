const bcrypt = require('bcrypt');

module.exports = class User {

    constructor(dbInstance) {
        this.database = dbInstance;
    }

    createUser(
        username,
        password,
    ) {

    }

    async getUsernameById(userId) {
        const rawUserData = (await this.database.query(
        `SELECT name FROM users WHERE id='${userId}';`
        ));
        if (!rawUserData[0]) {
            return null;
        }
        return rawUserData[0].name;
    }

    async getUserByName(username) {
        const rawUserData = (await this.database.query(
        `SELECT * FROM users WHERE upper(name)='${username.toUpperCase()}';`
        ));
        if (!rawUserData[0]) {
            return null;
        }
        return rawUserData[0];
    }

    checkCredentials(username, password) {
        return new Promise(async (resolve, reject) => {
            const user = (await this.getUserByName(username));
            if (user === null) {
                return resolve(false);
            }
            if (password === user.password) {
                resolve([true, user]);
            } else {
                resolve(false);
            }
        });
    }

}
