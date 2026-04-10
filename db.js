const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1122@",   // change this
    database: "cms_attendence"
});

db.connect(err => {
    if (err) console.log("DB Error:", err);
    else console.log("DB Connected");
});

module.exports = db;