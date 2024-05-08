const { BadRequestError } = require("../../core/error.response");
const discountModel = require('../discount.model');

const checkExistDisocunt = async ( discountCode ) => {
    const foundDiscount = await discountModel.findOne({discount_code: discountCode}).lean();
    return foundDiscount;
}

module.exports = {
    checkExistDisocunt
}