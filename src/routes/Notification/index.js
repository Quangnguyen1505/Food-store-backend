const express = require('express');
const notification = require('../../controllers/notification.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');

router.get("/listNoti", handlerError(notification.listNotification));

module.exports = router