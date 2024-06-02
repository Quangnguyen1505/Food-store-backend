const express = require('express');
const userController = require('../../controllers/user.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("", handlerError(userController.ListUser));

router.use(authencationV2);
router.post("/update", handlerError(userController.updateUser));
router.post("/delete", handlerError(userController.deleteUser));

module.exports = router