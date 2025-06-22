
import express  from "express";
import Notification, { BatchNotification } from "../Controller/NotificationController"

const  Router = express.Router()

Router.get('/:id',Notification.GetNotificationForAUser)
Router.put('/sendToAllBatch',BatchNotification)

export default Router