const { BadRequestError, NotFoundValueError } = require('../core/error.response')
const discountModel = require('../models/discount.model');
const { checkExistDisocunt } = require('../models/repo/discount.repo')

class DiscountService {
  static async createDiscount( payload ) {
    const{ code, name, value, startDate, endDate, count, foodIds } = payload;

    if(!name || !value || !startDate || !endDate){
      throw new NotFoundValueError('Missing required fields');
    }

    if(count < 0){
      throw new BadRequestError('Invalid count value');
    }

    if(new Date(startDate) >=  new Date(endDate)){
      throw new BadRequestError('Invalid date range');
    }

    const newDiscount = discountModel.create({
      discount_name: name,
      discount_code: code,
      discount_value: value,
      discount_start_date: startDate,
      discount_end_date: endDate,
      discount_count: count,
      discount_food_ids: foodIds
    });

    return newDiscount;
  }

  static async getDiscountAmout( payload ){
    const { discountCode, userId, foodItem } = payload;
    if( !discountCode || !userId || !foodItem ){
      throw new NotFoundValueError('Missing required fields');
    }

    const foundDiscount = await checkExistDisocunt(discountCode);
    if(!foundDiscount){
      throw new BadRequestError('Discount not found');
    }

    let ToTalOrder;

    ToTalOrder = await foodItem.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    
    // for( let i = 0; i < foodItem.length; i++){
    //   if( foundDiscount.discount_food_ids[i].includes(foodItem[i].foodId) ){
    //      amout = amout +  (ToTalOrder * ( foundDiscount.discount_value /100 ));
    //   }
    // }

    const amout = ToTalOrder * ( foundDiscount.discount_value /100 );
    return {
      totalPrice: ToTalOrder,
      valueVoucher: amout,
      totalAfterApplyDiscount: ToTalOrder - amout
    }
    
  }

  static async getAllDiscounts(){
    return discountModel.find().select('-__v');
  }

  static async getDiscountById( discountId ){
    const foundDiscount = await discountModel.findById(discountId).select('-__v');
    if(!foundDiscount){
      throw new BadRequestError('Discount not found');
    }

    return foundDiscount;
  }

  static async deleteDiscount( discountCode ){
    const foundDiscountCode = await checkExistDisocunt(discountCode);;
    if(!foundDiscountCode){
      throw new BadRequestError('Discount not found');
    }

    const delDiscount = discountModel.findByIdAndDelete(foundDiscountCode._id);

    return delDiscount;
  }

}

module.exports = DiscountService;