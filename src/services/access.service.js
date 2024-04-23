const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("../models/repo/access.repo");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenServices = require("./keyToken.service");
const { getInfoData } = require("../utils");
const userModel = require("../models/user.model");
const tokenModel = require("../models/keyToken.model");
const JWT = require('jsonwebtoken');
const { sendMail } = require("../utils/sendMail");

RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static login = async ({ email, password, refreshToken = null })=>{
        /*
           1. Check email in dbs
           2. match password
           3. create AT vs RT and save
           4. generate token
           5. get data return login
       */
       //1.
       const foundShop = await findByEmail({ email });
       if(!foundShop) throw new BadRequestError('Shop is not registered');

       //2.
       const match = await bcrypt.compare( password, foundShop.password );
       if(!match) throw new AuthFailureError('Authencation error');

       //3.
       const privateKey = crypto.randomBytes(64).toString('hex');
       const publicKey = crypto.randomBytes(64).toString('hex');

       //4.
       const { _id: userId } = foundShop;
       const tokens = await createTokenPair({ userId, email }, publicKey, privateKey );
       
       await KeyTokenServices.createKeyToken({
           refreshToken: tokens.refreshToken,
           userId,
           publicKey,
           privateKey,
       })

       return {
           shop: getInfoData({ fileds:['_id', 'name', 'email'], object:foundShop }),
           tokens
       }
   }

   static signUp = async ({ name, email, password, address})=>{
       // try {
           
           // step1: check email exists??
           const hodelShop = await userModel.findOne({ email }).lean();
           if(hodelShop){
               throw new BadRequestError('Error: Shop already registered!');
           }
           const passwordHash = await bcrypt.hash(password, 10);
           const newShop = await userModel.create({
               name, email, password:passwordHash, roles:[RoleShop.SHOP], address
           })
           if(newShop){
               //created privateKey,publicKey
               // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa',{
               //     modulusLength:4096,
               //     publicKeyEncoding: {
               //         type: 'pkcs1',
               //         format: 'pem'
               //     },
               //     privateKeyEncoding: {
               //         type: 'pkcs1',
               //         format: 'pem'
               //     },
               //     // public key cryptography standards
               // });

               const privateKey = crypto.randomBytes(64).toString('hex');
               const publicKey = crypto.randomBytes(64).toString('hex');
               console.log({privateKey,publicKey});

               const keyStore = await KeyTokenServices.createKeyToken({
                   userId:newShop._id,
                   publicKey,
                   privateKey
               });
               if(!keyStore){
                   throw new BadRequestError('Error: keyStore error!');
                   // return {
                   //     code: 'xxx',
                   //     message:'publicKeyString error!'
                   // }
               }
               // console.log("publicKeyString::", publicKeyString);
               // const publicKeyObject = crypto.createPublicKey( publicKeyString );

               // console.log("publicKeyObject::",publicKeyObject);
               // create token pair
               const tokens = await createTokenPair({ userId:newShop._id, email }, publicKey, privateKey );
               console.log("tokens create successfully!", tokens);

               return {
                   code: 201,
                   metadata: {
                       shop: getInfoData({ fileds:['_id', 'name', 'email'], object:newShop }),
                       tokens
                   }
               }
           }
           return {
               code: 200,
               metadata: null
           }
       // } catch (error) {
       //     return {
       //         code: 'xxx',
       //         message: error.message,
       //         status: 'error'
       //     }
       // }
   }

   static getProfile = async ( userId ) => {
        const foundUser = await userModel.findById(userId).lean();
        if(!foundUser) throw new BadRequestError('User is not registered');
        return foundUser;
   }

   static logout = async (keyStore) => {
        const delToken = await tokenModel.deleteOne(keyStore);
        return delToken;
   }

   static forgotPassword = async ({email}) => {
        console.log("emailss", {email});
        const foundShop = await findByEmail({ email });
        if(!foundShop) throw new BadRequestError('Shop is not registered');

        const resetToken = crypto.randomBytes(64).toString('hex');

        foundShop.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        foundShop.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        const query = { email }, updateSet = {
            $set: {
                resetPasswordToken: foundShop.resetPasswordToken
            },
            $addToSet: {
                resetPasswordExpires: foundShop.resetPasswordExpires
            }
        }

        await userModel.updateOne(query, updateSet);

        const html  = `Please click <a href=${process.env.URL_SERVER}/reset-password/${resetToken}> here </a> for change password !! you have exprie 15 minute`

        const data = {
            email,
            html
        }
        const rs = await sendMail(data);
        return rs;
    }

    static resetPassword = async ({ newPassword, paramsToken }) => {
        const resetToken = crypto.createHash('sha256').update(paramsToken).digest('hex');
        const foundToken = await userModel.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now()} });
        if(!foundToken) throw new BadRequestError("find token not exists!!");
        const passwordHash = await bcrypt.hash(newPassword, 10);
        foundToken.password = passwordHash;
        foundToken.resetPasswordToken = '';
        foundToken.resetPasswordExpires = undefined;
        await foundToken.save();
    }
}

module.exports = AccessService