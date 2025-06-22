
import express  from "express";
import Notification from "../Controller/NotificationController"

const  Router = express.Router()

Router.get('/:id',Notification.GetNotificationForAUser)
Router.put('/sendBulk',Notification.processBatchNotifications)

export default Router