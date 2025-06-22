
import express, { json } from 'express'
import dotenv from 'dotenv'
import connectDataBase from './config/dataBase'
import cors from 'cors'
import UserRouter from './Router/UserRouter'
import EventRouter from './Router/EventRouter'
import NotificationRouter from './Router/NotificationRouter'
import BatchSchedule from './Middleware/BatchSchedule'


const app = express()
dotenv.config()
app.use(json())
app.use(cors())

//user router
app.use('',UserRouter)

//event router
app.use('/Event',EventRouter)

//get notification for a user
app.use('/Notification',NotificationRouter)

// to send the low priority notification once per day
BatchSchedule()

connectDataBase()
const PORT = process.env.PORT || 3002
app.listen(PORT,()=>console.log(`server is running on PORT ${PORT}`))
