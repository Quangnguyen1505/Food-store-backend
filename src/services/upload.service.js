const cloudinary = require('../config/cloudinary.config');
const { BadRequestError } = require('../core/error.response');

class UploadService {
    static async uploadImageFromLocal({ path, folderName = 'Food/user'}){
        const result = await cloudinary.uploader.upload(path, {
            public_id: `${Date.now()}`,
            folder: folderName
        });
        if(!result) throw new BadRequestError('Upload failed !');

        return {
            image_url: result.secure_url,
            item_food: 'item-food',
            thumb_url: await cloudinary.url( result.public_id, {
                width: 100,
                height: 100,
                format: 'jpg'
            })
        }
    }

    static async uploadManyImageFromLocal({files, folderName = 'Food/user'}){
        if(!files.length) throw new BadRequestError('image not exists!!');

        const uploadedUrls = [];
        for( const file of files ){
            const result = await cloudinary.uploader.upload(file.path, {
                public_id: `${Date.now()}`,
                folder: folderName
            });
            if(!result) throw new BadRequestError('Upload failed !');

            uploadedUrls.push({
                image_url: result.secure_url,
                shopId: 8409,
                thumb_url: await cloudinary.url( result.public_id, {
                    width: 100,
                    height: 100,
                    format: 'jpg'
                })
            });
        }

        return uploadedUrls;
    }
}

module.exports = UploadService