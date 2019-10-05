const mysql = require("mysql");
const sqlConfig = require("../config/sql-config.js");
const sqlPool = mysql.createPool(sqlConfig);
module.exports = {
  getStudents: (req, res) => {
    let commands = `SELECT * FROM students`;
    sqlPool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(commands, (error, results, fields) => {
        // let row = results.raw
        res.json(results);
        connection.release();
      });
    });
  },

  createStudent: (req, res) => {
    let student = req.body.student;
    sqlPool.getConnection((err, connection) => {
      let check_cmd =
        "SELECT * FROM students WHERE badge_id = " +
        connection.escape(student.badge_id);
      connection.query(check_cmd, (error, results, fields) => {
        if (error) throw error;
        // console.log(results.length)
        if (results.length > 0) {
          res.json({ message: "Student already exists." });
          connection.release();
        } else {
          let create_cmd = `INSERT INTO students (first_name, last_name, badge_id) VALUES (?, ?, ?)`;
          connection.query(
            create_cmd,
            [student.first_name, student.last_name, student.badge_id],
            (error, result, fields) => {
              if (error) throw error;
              console.log(result.insertId);
              let create_record_cmd = `INSERT INTO records (student_id) VALUES ('${result.insertId}')`;
              connection.query(create_record_cmd, (error, result, fields) => {
                res.json({ message: "Successfully created." });
                connection.release();
              });
            }
          );
        }
      });
    });
  },

  // updateStudent: (req, res) => {
  //   let { student_id } = req.params;
  //   sqlPool.getConnection((err, connection) => {
  //     if (err) throw err;
  //     let check_cmd = `UPDATE students SET FROM students WHERE id = ` + connection.escape(student_id);
  //     connection.query(check_cmd, (error, results, fields) => {
  //       res.json(results);
  //       connection.release();
  //     });
  //   });
  // },

  deleteStudent: (req, res) => {
    let { student_id } = req.params;
    sqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let check_cmd =
        `DELETE FROM students WHERE id = ` + connection.escape(student_id);
      connection.query(check_cmd, (error, results, fields) => {
        res.json(results);
        connection.release();
      });
    });
  }
};
