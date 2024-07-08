const { SuccessResponse } = require('../core/success.response');
const userService = require('../services/user.service');

class UserController {

    createUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create user success",
            metadata: await userService.createUser(req.body)
        }).send(res);
    }

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
            metadata: await userService.deleteUser(req.params.userId)
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