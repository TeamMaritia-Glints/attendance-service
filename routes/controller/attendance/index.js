const checkIn = require('./checkIn');
const checkOut = require('./checkOut');
const userAttendances = require('./userAttendances');
const employeeAbsenceReport = require('./employeeAbsenceReport');
const userAttendanceReport = require('./userAttendanceReport');
const updateAttendanceStatus = require('./updateAttendanceStatus');

module.exports={
    checkIn,
    checkOut,
    userAttendances,
    employeeAbsenceReport,
    userAttendanceReport,
    updateAttendanceStatus
}