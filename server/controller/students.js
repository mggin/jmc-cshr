const mysql = require("mysql");
const Bcrypt = require("bcrypt");
const config = require("../config/key.json");
const sqlConfig = require("../config/sql-config.js");
const isValidToken = require('./validator');
const Jwt = require('jsonwebtoken');
const sqlPool = mysql.createPool(sqlConfig);
module.exports = {
  getStudents: (req, res) => {
    let commands = `SELECT * FROM students`;
    if (isValidToken(req)) {
      sqlPool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(commands, (error, results, fields) => {
          res.json(results);
          connection.release();
        });
      });
    } else {
      res.json('Access Denied')
    }
  },

  createStudent: (req, res) => {
    let student = req.body.student;
    sqlPool.getConnection((err, connection) => {
      console.log(student);
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
          console.log(create_cmd);
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

  updateStudent: (req, res) => {
    let { student_id } = req.params;
    let { student } = req.body;
    sqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let check_cmd = `UPDATE students SET first_name = ?, last_name = ?, badge_id = ?, grade = ? WHERE id = ?`;
      connection.query(
        check_cmd,
        [
          student.first_name,
          student.last_name,
          student.badge_id,
          student.grade,
          student_id
        ],
        (error, results, fields) => {
          res.json(results);
          connection.release();
        }
      );
    });
  },

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
  },

  login: (req, res) => {
    let { username, password } = req.body;
    sqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let login_cmd =
        "SELECT * FROM admin WHERE user_name = " +
        connection.escape(`${username}`);
      connection.query(login_cmd, (error, results, fields) => {
        // let row = results.raw
        if (results.length > 0) {
          let admin = results[0];
          console.log(admin.password)
          Bcrypt.compare(password, admin.password).then(response => {
            console.log(response)
            if (response) {
              let payload = { id: admin.id };
              let token = Jwt.sign(payload, config.tokenKey, {
                expiresIn: "1440m"
              });
              res.json({ token: token });
              connection.release();
            } else {
              res.json({ errors: "Invalid user input" });
              connection.release();
            }
          });
        }
      });
    });
  },
  
  signUp: (req, res) => {
    let { username, password } = req.body;
    sqlPool.getConnection((err, connection) => {
      if (err) throw err;
      Bcrypt.hash(password, 10).then(hashedpassword => {
        let sign_up_cmd = `INSERT INTO admin (user_name, password) VALUES (?, ?)`;
        connection.query(
          sign_up_cmd,
          [username, hashedpassword],
          (error, results, fields) => {
            // let row = results.raw
            res.json(results);
            connection.release();
          }
        );
      });
    });
  }
};
