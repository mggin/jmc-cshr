const mysql = require('mysql');
const sqlConfig = require('../config/sql-config.js');
const sqlPool = mysql.createPool(sqlConfig);
module.exports = {
  getRecords: (req, res) => {
    let records_cmd = `SELECT
    students.first_name, 
    students.last_name,
    students.grade,
    records.january,
    records.february,
    records.march,
    records.april,
    records.may,
    records.june,
    records.july,
    records.august,
    records.september,
    records.october,
    records.november,
    records.december,
    records.total
    FROM students JOIN records ON students.id = records.student_id;`
    sqlPool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(records_cmd, (error, results, fields) => {
            res.json(results);
            connection.release();
        })
    })

  },
};
