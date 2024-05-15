const { SuccessResponse } = require("../core/success.response");
const notificationService = require("../services/notification.service");

class NotificationController{
    listNotification = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create Notification success",
            metadata: await notificationService.listNoti(req.query)
        }).send(res);
    }
}


module.exports = new NotificationController();