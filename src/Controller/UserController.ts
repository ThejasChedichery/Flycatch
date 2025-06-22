
import { Request, Response } from "express";
import Userdata from "../Model/ModelUser";


interface RegUser {
    name: string;
    email: string;
    mobNo?: string;
    notificationPreferences: {
        eventType: string;
        notificationType: ('email' | 'sms' | 'in-app')[]
    }[];
}

interface EditPreferences {
    notificationPreferences: {
        eventType: string;
        notificationType: ('email' | 'sms' | 'in-app')[]
    }[];
}

interface Params {
    id: string
}

// user registration
export const RegisterUser = async (
    req: Request<{}, {}, RegUser>,
    res: Response
) => {

    let count = await Userdata.countDocuments() + 1
    try {
        const registration = new Userdata({ id: count, ...req.body })
        const saveRegistration = await registration.save()
        res.status(200).send({ message: "User Registration successfull", saveRegistration })

    } catch (error) {
        res.status(500).send({ message: 'Canot register user', error })
    }
}

// edit user Preferences

export const EditUserPreferance = async (
    req: Request<Params, {}, EditPreferences>,
    res: Response
) => {

    const updateData = req.body
    const userId = parseInt(req.params.id)
    try {
        const updatePreferences = await Userdata.findOneAndUpdate({ id: userId },
            { $set: { notificationPreferences: updateData.notificationPreferences } }, { new: true })
        if (!updatePreferences) {
            res.status(404).send({ message: 'No user found' })
        }
        res.status(200).send({ message: "User Preference updated successfully", updatePreferences })
    } catch (error) {
        res.status(500).send({ message: "Can't update Preference", error })
    }
}
