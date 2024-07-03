const express = require('express');
const userController = require('../../controllers/user.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const rateLimiter = require('../../middleware/rateLimiter');

router.get("", handlerError(userController.ListUser));
router.get("/current/:id", handlerError(userController.getOneUser));

router.use(authencationV2);
router.use(rateLimiter);

router.post("/update", handlerError(userController.updateUser));
router.post("/delete", handlerError(userController.deleteUser));

module.exports = router