const express = require('express');
const router = express.Router();

const officeController = require('./controller/office'); //Import Controller

const role= require('../middlewares/permission'); //For Verify User Role Login

/* POST office. */
router.post('/', role("admin"), officeController.create);

/* Get office by id. */
router.get('/:id', officeController.get);

/* Get all office. */
router.get('/', officeController.getAll);

/* Update office . */
router.put('/:id', role("admin"), officeController.update);

/* Delete office . */
router.delete('/:id', role("admin"), officeController.destroy);


module.exports = router;
