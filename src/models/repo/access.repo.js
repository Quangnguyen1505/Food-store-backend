const userModel = require('../user.model');

const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, status: 1, roles: 1
} }) => {
    return await userModel.findOne({email}).select(select).lean();
}

const findUserById = async (userId) => {
    return await userModel.findById(userId).lean();
}

module.exports = {
    findByEmail,
    findUserById
} 