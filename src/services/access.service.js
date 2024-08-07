const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("../models/repo/access.repo");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenServices = require("./keyToken.service");
const { getInfoData } = require("../utils");
const userModel = require("../models/user.model");
const tokenModel = require("../models/keyToken.model");
const { sendMail } = require("../utils/sendMail");
const { userValidate } = require("../helper/validation");

Role = {
    USER:'USER',
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
       const foundShop = await findByEmail({ email: email.toLowerCase() });
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
           shop: getInfoData({ fileds:['_id', 'name', 'email', 'roles'], object:foundShop }),
           tokens
       }
   }

   static signUp = async ({ name, email, password, address, role_name = 'USER'})=>{

            const { error } = userValidate({ email, password });
            if(error) throw new BadRequestError(error.details[0].message);
            // step1: check email exists??
            const hodelShop = await userModel.findOne({ email: email.toLowerCase() }).lean();
            if(hodelShop){
                throw new BadRequestError('Error: Shop already registered!');
            }
            const hashRandom = crypto.randomBytes(64).toString('hex');
            const passwordHash = await bcrypt.hash(password, 10);
            const hashEmail = btoa(email) + '@' + hashRandom;
            const newShop = await userModel.create({
                name, email: hashEmail, password:passwordHash, roles:[role_name], address
            });
            if(newShop){
                const html  = `<h2>Code: </h2> <br> <blockquote>${hashRandom}</blockquote>`
                const data = {
                    html,
                    email,
                    subject: `Please finish comfirm register`
                }
                await sendMail(data);

                setTimeout( async ()=> {
                    await userModel.findOneAndDelete({email: hashEmail});
                }, 30*1000);
                // return data;
                
            }
            return {
                code: 200,
                metadata: null
            }
   }

   static finalSignUp = async (payload) => {
        const { hashEmail } = payload;
        const foundHashEmail = await userModel.findOne({email: new RegExp(`${hashEmail}$`)});
        if(foundHashEmail) {
            foundHashEmail.email = await atob(foundHashEmail.email.split('@')[0]);
            await foundHashEmail.save()

            //created privateKey,publicKey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            console.log({privateKey,publicKey});

            const keyStore = await KeyTokenServices.createKeyToken({
                userId:foundHashEmail._id,
                publicKey,
                privateKey
            });
            if(!keyStore){
                throw new BadRequestError('Error: keyStore error!');
            }
            // create token pair
            const tokens = await createTokenPair({ userId:foundHashEmail._id, email: foundHashEmail.email  }, publicKey, privateKey );
            console.log("tokens create successfully!", tokens);
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fileds:['_id', 'name', 'email', 'roles'], object: foundHashEmail }),
                    tokens
                }
            }
        }
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
            html,
            subject: "Forgot password"
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