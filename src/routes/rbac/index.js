const express = require('express');
const rbacController = require('../../controllers/rbac.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');

router.post('/resource', handlerError(rbacController.newResource));
router.get('/resource', handlerError(rbacController.getResource));

router.post('/role', handlerError(rbacController.newRole));
router.get('/role', handlerError(rbacController.getRole));

module.exports = router;