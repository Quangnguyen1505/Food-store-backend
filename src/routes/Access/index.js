const express = require('express');
const AccessService = require('../../controllers/access.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');

router.post("/signUp", handlerError(AccessService.signUp));
router.post("/login", handlerError(AccessService.login));

module.exports = router