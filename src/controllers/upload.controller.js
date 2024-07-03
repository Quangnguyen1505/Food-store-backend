const { SuccessResponse } = require('../core/success.response');
const uploadService = require('../services/upload.service');

class UploadController {
    uploadImageFromLocal = async (req, res, next) =>{
        console.log("req.file",req.file );
        new SuccessResponse({
            message: "upload image from local success",
            metadata: await uploadService.uploadImageFromLocal({path: req.file.path})
        }).send(res)
    }

    uploadManyImageFromLocal = async (req, res, next) =>{
        new SuccessResponse({
            message: "upload many image from local success",
            metadata: await uploadService.uploadManyImageFromLocal({files: req.files})
        }).send(res)
    } 
}

module.exports = new UploadController();