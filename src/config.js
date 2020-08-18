require('dotenv').config();

module.exports = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'TobiFTW23',
        database: process.env.DATBASE || 'chrisregnery',
    },
    audiodir: "/home/ijustdev/Fiverr/chrisregnery/vocabulary-exchange/audios/",
};
