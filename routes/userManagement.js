const express = require('express');
const router = express.Router();

const userManagementController = require('./controller/userManagement'); //Import Controller

const role= require('../middlewares/permission'); //For Verify User Role Login


/* Get userManagement by id. */
router.get('/:id', role("admin"), userManagementController.get);

/* Get all userManagement. */
router.get('/', userManagementController.getAll);

/* Update userManagement . */
router.put('/:id', role("admin"), userManagementController.update);

module.exports = router;
