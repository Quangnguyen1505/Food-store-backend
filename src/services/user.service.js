const { BadRequestError } = require("../core/error.response");
const { findUserById } = require("../models/repo/access.repo");
const userModel = require("../models/user.model");

class UserService {
    static async getListUser({ limit = 8, sort = 'ctime', page = 1 }){
        const skip = ( page - 1 ) * limit;
        const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
        const foundUsers = await userModel.find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)

        return foundUsers;
    }

    static async updateUser( userId, payload ){
        const foundUser = await findUserById(userId);
        if(!foundUser) throw new BadRequestError('User not extsit');
        
        return await userModel.findByIdAndUpdate(userId, payload, {
            new: isNew
        });
    }

    static async deleteUser(userId){
        const foundUser = await findUserById(userId);
        if(!foundUser) throw new BadRequestError('User not extsit');

        return await userModel.findByIdAndDelete(userId);
    }

}

module.exports = UserService;