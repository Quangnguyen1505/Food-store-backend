const express = require('express');
const AccessService = require('../../controllers/access.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const rateLimiter = require('../../middleware/rateLimiter');

router.post("/signUp", handlerError(AccessService.signUp));
router.post("/finalSingup", handlerError(AccessService.finalSignUp));
router.post("/login", handlerError(AccessService.login));
router.post("/forgotpassword", handlerError(AccessService.forgotPassword));
router.post("/reset-password", handlerError(AccessService.resetPassword));

router.use(authencationV2);
router.use(rateLimiter);

router.get("/logout", handlerError(AccessService.logout));
router.get("/profile", handlerError(AccessService.getProfile));

module.exports = router