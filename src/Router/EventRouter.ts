
import express from 'express'
import CreateEvent from '../Controller/EventController'
import Notification from '../Controller/NotificationController'

const Router = express.Router()

Router.post('/',CreateEvent,Notification.CreateNotification)

export default Router