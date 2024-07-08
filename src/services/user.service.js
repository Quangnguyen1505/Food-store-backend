const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError } = require("../core/error.response");
const { findUserById } = require("../models/repo/access.repo");
const userModel = require("../models/user.model");
const ROLE = require('../models/role.model');
const { getInfoData } = require("../utils");
const KeyTokenServices = require("./keyToken.service");
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class UserService {
    static async getListUser({ limit = 8, sort = 'ctime', page = 1 }){
        const skip = ( page - 1 ) * limit;
        const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
        // const foundUsers = await userModel.find()
        // .limit(limit)
        // .skip(skip)
        // .sort(sortBy)
        // return foundUsers;
        const match = { roles: 'USER'}
        const foundUsersV2 = await userModel.aggregate([
            // {
            //     $match: match
            // },
            {
                $sort: sortBy
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    address: 1,
                    avatarUrl: 1,
                }
            }
        ]);

        return foundUsersV2;
    }

    static async updateUser({ userId, body }){
        console.log("update::", { userId, body });
        const foundUser = await findUserById(userId);
        if(!foundUser) throw new BadRequestError('User not extsit');
        
        return await userModel.findByIdAndUpdate(userId, body, {
            new: true
        });
    }

    static async deleteUser(userId){
        const foundUser = await findUserById(userId);
        if(!foundUser) throw new BadRequestError('User not extsit');

        return await userModel.findByIdAndDelete(userId);
    }

    static async getUserById(userId){
        const foundUser = await findUserById(userId);
        if(!foundUser) throw new BadRequestError('User not extsit');

        return foundUser;
    }

    static createUser = async (payload) => {
        const { name, email, password, address, status, role_name = 'USER', avatarUrl } = payload;

        const hodelUser = await userModel.findOne({ email: email.toLowerCase() }).lean();
        if(hodelUser){
            throw new BadRequestError('Error: Shop already registered!');
        }

        const foundRole = await ROLE.findOne({role_name}).lean();
        if(!foundRole) throw new BadRequestError('role not exitst!!');

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name, email, password:passwordHash, roles:[foundRole._id], address, avatarUrl, status
        });
        if(newUser){
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            console.log({privateKey,publicKey});

            const keyStore = await KeyTokenServices.createKeyToken({
                userId:newUser._id,
                publicKey,
                privateKey
            });
            if(!keyStore){
                throw new BadRequestError('Error: keyStore error!');
            }
            // create token pair
            const tokens = await createTokenPair({ userId:newUser._id, email: newUser.email  }, publicKey, privateKey );
            console.log("tokens create successfully!", tokens);
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fileds:['_id', 'name', 'email', 'roles'], object: newUser }),
                    tokens
                }
            }
        }
   }

}

module.exports = UserService;