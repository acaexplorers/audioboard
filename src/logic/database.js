const mysql = require('mysql2');
const config = require('../config');

module.exports = class Database {

    connect() {
        return new Promise(async (resolve) => {
            const dbConfig = config.db;
            const con = await mysql.createConnection({
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.database,
                multipleStatements: true,
            });
            this.con = con;
            resolve();
        });
    }

    query(query) {
        if (this.con === undefined) {
            throw new Error('Not connected to Database');
        }
        return new Promise((resolve, reject) => {
            this.con.query(query, (err, result, fields) => {
                if (err) {
                    console.log(query);
                    console.log(err);
                    return resolve(undefined);
                }
                resolve(result);
            });
        });
    }

    close() {
        this.con.close();
    }

}
