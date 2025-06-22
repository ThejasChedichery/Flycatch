
import { NextFunction, Request, Response } from "express";
import EventData from "../Model/ModelEvent";

type createBody = {
    title: string;
    description: string;
    type: string;
    priority: 'low' | 'high';
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

export default CreateEvent