const express = require('express');
const router = express.Router();

const checkInController = require('./controller/attendance'); //Import Controller

/* POST employee check in request. */
router.post("/check-in", checkInController.checkIn);

module.exports = router;