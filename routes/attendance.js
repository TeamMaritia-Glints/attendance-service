const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); //Import Verify Token

const checkInController = require('./controller/attendance'); //Import Controller

/* POST employee check in request. */
router.post("/check-in", verifyToken, checkInController.checkIn);
router.post("/check-out", verifyToken, checkInController.checkOut);

module.exports = router;