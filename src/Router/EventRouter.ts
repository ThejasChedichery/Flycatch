
import express from 'express'
import Event from '../Controller/EventController'
import Notification from '../Controller/NotificationController'

const Router = express.Router()

Router.post('',Event.CreateEvent,Notification.CreateNotification)
Router.post('/Notification/Bulk',Event.CreateBulkEvent)

export default Router