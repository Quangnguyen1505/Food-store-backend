const { BadRequestError, NotFoundValueError } = require('../core/error.response')
const discountModel = require('../models/discount.model');
const { checkExistDisocunt } = require('../models/repo/discount.repo');
const { createNotification } = require('./notification.service');

class DiscountService {
  static async createDiscount( payload ) {
    const{ discount_code, discount_name, discount_value,
      discount_start_date, discount_end_date, discount_count, discount_food_ids } = payload;

    if(!discount_name || !discount_value || !discount_start_date || !discount_end_date){
      throw new NotFoundValueError('Missing required fields');
    }

    if(discount_count < 0){
      throw new BadRequestError('Invalid count value');
    }

    if(new Date(discount_start_date) >=  new Date(discount_end_date)){
      throw new BadRequestError('Invalid date range');
    }

    const newDiscount = await discountModel.create({
      discount_name,
      discount_code,
      discount_value,
      discount_start_date,
      discount_end_date,
      discount_count,
      discount_food_ids
    });

    if(!newDiscount) throw new BadRequestError('Create discount failed');

    await createNotification({
      noti_type: "PROMOTION-001",
      noti_options: {
        discountId: newDiscount._id,
        discountName: newDiscount.discount_name
      }
    })

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

  static async getAllDiscounts({limit = 8, sort = 'ctime', page = 1}){
    const skip = (page - 1) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    return discountModel.find().select('-__v').limit(limit).skip(skip).sort(sortBy);
  }

  static async getDiscountById( discountId ){
    const foundDiscount = await discountModel.findById(discountId).select('-__v');
    if(!foundDiscount){
      throw new BadRequestError('Discount not found');
    }

    return foundDiscount;
  }

  static async deleteDiscount( discountId ){
    const foundDiscountId = await discountModel.findById(discountId);
    if(!foundDiscountId){
      throw new BadRequestError('Discount not found');
    }

    const delDiscount = discountModel.findByIdAndDelete(foundDiscountId._id);

    return delDiscount;
  }

  static async updateDiscount( payload ){
    console.log("payload::", payload);
    const { discountId, discount_endDate, discount_start_date, discount_end_date, discount_count } = payload;

    if(!discountId || !discount_start_date || !discount_end_date){
      throw new NotFoundValueError('Missing required fields');
    }

    if(discount_count < 0){
      throw new BadRequestError('Invalid count value');
    }

    if(new Date(discount_start_date) >=  new Date(discount_end_date)){
      throw new BadRequestError('Invalid date range');
    }

    const updateDis = await discountModel.findByIdAndUpdate(discountId, payload, {
      new: true
    });

    return updateDis;
  }

}

module.exports = DiscountService;