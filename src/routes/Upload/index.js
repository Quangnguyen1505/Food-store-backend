const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const asyncHandler = require('../../helper/asyncHandler');
const {uploadDisk, uploadMemory} = require('../../config/multer.config');
const { authencationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.use(authencationV2);
router.post('/user/thumb', uploadDisk.single('file'),uploadController.uploadImageFromLocal);
router.post('/user/files/thumb', uploadDisk.array('files'),uploadController.uploadManyImageFromLocal);

module.exports = router