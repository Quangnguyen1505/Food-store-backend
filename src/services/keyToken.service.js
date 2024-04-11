const keyTokenModel = require("../models/keyToken.model");
const { Types: { ObjectId } } = require('mongoose');
class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const fitler = { user: userId }, update = {
                 publicKey, privateKey, refreshTokensUsed: [], refreshToken
                }, options = { upsert: true, new: true};
            const tokens = await keyTokenModel.findOneAndUpdate( fitler, update, options );
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await keyTokenModel.findOne({ user: new ObjectId(userId) })
    }
}

module.exports = KeyTokenServices