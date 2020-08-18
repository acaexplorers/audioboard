const Database = require('../logic/database');

const db = new Database();
try {
    db.connect().then(() => {
        console.log("Database connection succeeded!")
    });
} catch {
    console.error("Could not connect to database!");
}
