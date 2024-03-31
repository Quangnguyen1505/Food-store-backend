const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("../models/repo/access.repo");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenServices = require("./keyToken.service");
const { getInfoData } = require("../utils");
const userModel = require("../models/user.model");

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

   static signUp = async ({ name, email, password})=>{
       // try {
           
           // step1: check email exists??
           const hodelShop = await userModel.findOne({ email }).lean();
           if(hodelShop){
               throw new BadRequestError('Error: Shop already registered!');
           }
           const passwordHash = await bcrypt.hash(password, 10);
           const newShop = await userModel.create({
               name, email, password:passwordHash, roles:[RoleShop.SHOP]
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
}

module.exports = AccessService