const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { userValidate } = require("../helper/validation");
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

    forgotPassword =  async (req,res,next)=>{
        console.log("req.body", req.body);
        new SuccessResponse ({
            message: "send email OK !!",
            metadata:  await AccessService.forgotPassword(req.body)
        }).send(res)
    }

    resetPassword = async (req,res,next)=>{
        new SuccessResponse ({
            message: "reset password OK !!",
            metadata:  await AccessService.resetPassword(req.body)
        }).send(res)
    }
}


module.exports = new FoodController();