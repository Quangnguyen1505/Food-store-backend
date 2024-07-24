const { NotFoundValueError } = require('../core/error.response');
const { NOTI } = require('../models/notidication.model');
const setType = require('../models/repo/notification.repo');

class NotificationService {

    static async createNotification( payload ) {
        const { noti_type, noti_options } = payload;
        if( !noti_type || !noti_options ) throw new NotFoundValueError('Missing value in payload');

        let noti_content;
        console.log("noti_options: ", noti_options);
         //stategy pattern
        noti_content = setType(noti_content, noti_type);

        const newNoti = await NOTI.create({
            noti_type,
            noti_content,
            noti_options
        });

        return newNoti;

    }

    static async listNoti({
        type = 'ALL'
    }){
        return await NOTI.aggregate([
            {
                $match: {
                    noti_type: type === 'ALL' ? { $exists: true } : type
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    noti_type: 1,
                    noti_content: 1,
                    noti_options: type === 'ALL' ? 1 : {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: [ type, 'PROMOTION-001' ] },
                                    then: {
                                        $concat: [
                                            { $toString: "$noti_options.discountId" },
                                            " Vừa mới thêm mã giảm giá mới ",
                                            { $toString: "$noti_options.discountName" }
                                        ]
                                    }
                                },
                                {
                                    case: { $eq: [ type, 'SHOP-001' ] },
                                    then: {
                                        $concat: [
                                            { $toString: "$noti_options.foodId" },
                                            " Vừa mới thêm sản phẩm mới ",
                                            { $toString: "$noti_options.foodName" }
                                        ]
                                    }
                                }
                            ],
                            default: "No specific information available"
                        }
                    },
                    createdAt: 1
                }
            }
        ])
    }
    
}

module.exports = NotificationService;