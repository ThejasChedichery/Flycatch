
import { NextFunction, Request, Response } from "express";
import EventData from "../Model/ModelEvent";
import Userdata from "../Model/ModelUser";
import NotificationData from "../Model/ModelNotification";

type createBody = {
    title: string;
    description: string;
    type: string;
    priority: 'low' | 'high';
}

interface BulkBody {
    userId: number;
    events: createBody[]
}
interface Preferance {
    eventType: string;
    notificationType: string[]
}

declare module 'express-serve-static-core' {
    interface Request {
        newEvent: {
            id: number;
            title: string;
            description: string;
            type: string;
            priority: 'low' | 'high';
            createdAt?: Date;
            updatedAt?: Date;
        }
    }
}

const CreateEvent = async (
    req: Request<{}, {}, createBody>,
    res: Response,
    next: NextFunction
) => {

    let count = await EventData.countDocuments() + 1

    try {
        const newEvent = new EventData({ id: count, ...req.body })
        const createNewEvent = await newEvent.save()
        req.newEvent = createNewEvent;
        next()
        res.status(200).send({ message: "Event creation successfull", createNewEvent })

    } catch (error) {
        res.status(500).send({ message: 'Canot create event', error })
    }
}

const CreateBulkEvent = async (
    req: Request<{}, {}, BulkBody>,
    res: Response,
) => {
    try {
        const user = await Userdata.findOne({ id: req.body.userId })
        if (!user) {
            res.status(400).send({ message: 'user Canot find' })
            return
        }
        for (const event of req.body.events) {
            let count = await EventData.countDocuments() + 1
            const newEvent = new EventData({ id: count, ...event })
            const createNewEvent = await newEvent.save()

            const notification = user.notificationPreferences?.find((datas: Preferance) => datas.eventType == createNewEvent.type)
            if (notification) {
                for (const element of notification?.notificationType) {
                    //notification sending
                    if (createNewEvent.priority == 'high') {
                        console.log(`Dear ${user?.name}, your ${element} notification 📤 : ${createNewEvent.title}(${createNewEvent.description}) 
                        is ${createNewEvent?.type == 'task_created' ? 'created' : 'closed'}`);
                    }
                    const createNotifications = new NotificationData({
                        userId: user.id,
                        eventId: createNewEvent.id,
                        eventType: createNewEvent.type,
                        notificationType: element,
                        eventPriority: createNewEvent.priority,
                        status: createNewEvent.priority == 'high'?'sent':'pending'
                    })
                    await createNotifications.save()
                }
            }
        }
        res.status(200).send({ message: 'created bulk event'})
    } catch (error) {
        res.status(500).send({ message: 'Canot create bulk event', error })
    }
}

export default {CreateEvent,CreateBulkEvent}