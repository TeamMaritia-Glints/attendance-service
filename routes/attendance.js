const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); //Import Verify Token
const role= require('../middlewares/permission');

const checkInController = require('./controller/attendance'); //Import Controller attendance

/* POST employee check in request. */
router.post("/check-in", verifyToken, checkInController.checkIn);
router.post("/check-out", verifyToken, checkInController.checkOut);

router.patch("/update-attendance-status",verifyToken, role("admin"), checkInController.updateAttendanceStatus);

router.get("/user-attendances", verifyToken, role("admin"), checkInController.userAttendances);
router.get("/employee-absence-report", verifyToken, role("admin"), checkInController.employeeAbsenceReport);
router.get("/user-attendance-report", verifyToken, checkInController.userAttendanceReport);

module.exports = router;