const { SuccessResponse } = require('../core/success.response');
const userService = require('../services/user.service');

class UserController {
    updateUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: "update user success",
            metadata: await userService.updateUser(req.body)
        }).send(res);
    }

    ListUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get list user success",
            metadata: await userService.getListUser(req.query)
        }).send(res);
    }

    deleteUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: "delete user success",
            metadata: await userService.deleteUser(req.userId)
        }).send(res);
    }

    getOneUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: "delete user success",
            metadata: await userService.getUserById(req.params.id)
        }).send(res);
    }
}

module.exports = new UserController();