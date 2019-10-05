const mysql = require("mysql");
const sqlConfig = require("../config/sql-config.js");
const sqlPool = mysql.createPool(sqlConfig);

module.exports = {
  createService: (req, res) => {
    let { student_id } = req.params;
    let service = req.body.service;
    sqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let create_cmd = `INSERT INTO services 
                        (time_in, time_out, service_date, service_title, service_location, student_id)
                        VALUES (?, ?, ?, ?, ?, ?)`;
      let value_list = [service.time_in, service.time_out, service.service_date, service.service_title, service.service_location, student_id]
      connection.query(create_cmd, value_list ,(error, results, fields) => {
        res.json(results);
        connection.release();
      });
    });
  }
};
