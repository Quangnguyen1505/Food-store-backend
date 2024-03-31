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
}


module.exports = new FoodController();