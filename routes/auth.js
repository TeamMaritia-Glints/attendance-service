const express = require('express');
const router = express.Router();

const authController = require('./controller/auth'); //Import Controller

const verifyToken = require('../middlewares/verifyToken'); //Import Verify Token
const role= require('../middlewares/permission'); //For Verify User Role Login


/* POST user register. */
router.post('/register', authController.register);

/* POST user Login. */
router.post('/login', authController.login);

/* POST user Logout. */
router.post('/logout', verifyToken, authController.logout);

/* PUT user Password. */
router.put('/updatepw', verifyToken, authController.updatepw);

/* POST user forgot Password. */
router.post('/forgotpw', authController.forgotpw);

/* PUT user Request Reset Password. */
router.put('/passwordReset', authController.pwReset);

module.exports = router;
