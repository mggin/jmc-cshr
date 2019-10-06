const records = require('../controller/records');
const students = require('../controller/students')
// const households = require('./../controllers/households');
// const users = require('./../controllers/users');

module.exports = (app) => {
    app.get('/api/records', records.getRecords)
    app.get('/api/students', students.getStudents)
    app.post('/api/create/student', students.createStudent)
    app.delete('/api/delete/student/:student_id', students.deleteStudent)
    app.put('/api/update/student/:student_id', students.updateStudent)
    app.post('/api/login/student', students.login)
    // app.post('/api/signup/student', students.signUp)
    
}
