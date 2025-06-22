import { Request, Response } from "express";
import Userdata from "../Model/ModelUser";
import NotificationData from "../Model/ModelNotification";
import EventData from "../Model/ModelEvent";
import BatchSchedule from "../Middleware/BatchSchedule";

interface Preferance {
    eventType: string;
    notificationType: string[]
}

interface IUser {
    id: number;
    name: string;
    email: string;
    mobNo?: string;
    notificationPreferences: Preferance[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface INotification {
    userId: number;
    eventId: number;
    eventType: string;
    notificationType: 'email' | 'sms' | 'in-app';
    eventPriority: 'low' | 'high';
    status: 'pending' | 'sent';
    createdAt?: Date;
    updatedAt?: Date;
}

const CreateNotification = async (req: Request, res: Response) => {
    try {
        const findUser = await Userdata.find({
            notificationPreferences: {
                $elemMatch: {
                    eventType: req.newEvent.type
                }
            }
        })

        if (findUser.length == 0) {
            console.log(`--- No User Subscribe for "${req.newEvent.type}" type---`);
            return
        }
        if (req.newEvent.priority == "high") {

            findUser?.forEach(async (item: IUser) => {
                const notification = item.notificationPreferences?.find((datas: Preferance) => datas.eventType == req.newEvent.type)
                if (notification) {
                    for (const element of notification?.notificationType) {
                        //notification sending

                        console.log(`Dear ${item?.name}, your ${element} notification 📤 : ${req?.newEvent?.title}(${req?.newEvent?.description}) 
                            is ${req?.newEvent?.type == 'task_created' ? 'created' : 'closed'}`);

                        const createNotifications = new NotificationData({
                            userId: item?.id,
                            eventId: req?.newEvent?.id,
                            eventType: req?.newEvent?.type,
                            notificationType: element,
                            eventPriority: req?.newEvent?.priority,
                            status: 'sent'
                        })

                        await createNotifications.save()
                    }
                }
            })
        }
        else if (req.newEvent.priority == "low") {
            findUser?.forEach(async (item: IUser) => {
                const notification = item.notificationPreferences?.find((datas: Preferance) => req.newEvent.type == datas.eventType)
                if (notification) {
                    for (const element of notification?.notificationType) {
                        //notification saving
                        const createNotifications = new NotificationData({
                            userId: item?.id,
                            eventId: req?.newEvent?.id,
                            eventType: req?.newEvent?.type,
                            notificationType: element,
                            eventPriority: req?.newEvent?.priority,
                            status: 'pending'
                        })
                        await createNotifications.save()
                    }
                }
            })
        }

    } catch (error) {
        res.status(500).send({ message: 'Canot create notification', error })
    }

}

const processBatchNotifications = async () => {

    const pendingNotification = await NotificationData.find({ status: 'pending', eventPriority: 'low' })
    if (pendingNotification.length == 0) {
        console.log(`--- No Batch notification pending---`);
        return 
    }
    for (const items of pendingNotification) {
        const user = await Userdata.findOne({ id: items.userId })
        const event = await EventData.findOne({ id: items.eventId })
        if (!user || !event) {
            console.log(`--- No user or evend exist---`);
            return
        }
        console.log(`Dear ${user?.name}, your ${items.notificationType} notification 📤 : ${event?.title}(${event?.description}) 
                    is ${event?.type == 'task_created' ? 'created' : 'closed'}`);
        const sasi = await NotificationData.findByIdAndUpdate(items._id,
            { $set: { status: 'sent' } })
    }

}

export const BatchNotification = async (
    req: Request,
    res: Response
) => {
    try {
        await processBatchNotifications() 
        res.status(200).send({ message: 'sent batch notification' })

    } catch (error) {
        res.status(500).send({ message: 'Canot send batch notification', error })
    }
}

const GetNotificationForAUser = async (
    req: Request,
    res: Response
) => {

    try {
        const qType = req.query.qType;
        const qDate = req.query.qDate;
        const qPriority = req.query.qPriority;

        const query: any = {
            userId: req.params.id
        };

        if (qType) {
            query.eventType = { $regex: qType, $options: 'i' };
        }

        if (qPriority) {
            query.eventPriority = { $regex: qPriority, $options: 'i' };
        }

        if (qDate) {
            const start = new Date(qDate as string);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);

            query.createdAt = { $gte: start, $lt: end };
        }

        const getUserNotification = await NotificationData.find(query);


        const Data = await Promise.all(getUserNotification?.map(async (item: any) => {
            const event = await EventData.findOne({ id: item.eventId })
            const user = await Userdata.findOne({ id: item.userId })
            return {
                ...item.toObject(),
                event: event?.toObject(),
                user: user?.toObject()
            }
        }))

        res.status(200).send({ message: "Notification fetch successfull", Data })
    } catch (error) {
        res.status(500).send({ message: 'Canot find notification', error })
    }

}

export default { CreateNotification, processBatchNotifications, GetNotificationForAUser }