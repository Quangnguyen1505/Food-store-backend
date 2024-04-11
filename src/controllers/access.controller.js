const { SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class FoodController{
    signUp = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create user success",
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    }

    login = async ( req, res, next ) => {
        new SuccessResponse({
            message: "login user success",
            metadata: await AccessService.login(req.body)
        }).send(res);
    } 

    logout = async (req,res,next) => {
        new SuccessResponse({
            message: "logout user success",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    getProfile = async (req,res,next) => {
        new SuccessResponse({
            message: "get profile success",
            metadata: await AccessService.getProfile(req.userId)
        }).send(res);
    }
}


module.exports = new FoodController();