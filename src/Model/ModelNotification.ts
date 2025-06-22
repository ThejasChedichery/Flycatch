
import mongoose from "mongoose";

interface INotification extends mongoose.Document{

    userId : number;
    eventId :number;
    eventType: string;
    notificationType:'email'| 'sms'| 'in-app';
    eventPriority : 'low' | 'high';
    status : 'pending' | 'sent' ;
    createdAt?: Date;
    updatedAt?: Date;
}

// notification creatiomn schema
const NotificationSchema = new mongoose.Schema<INotification>({

    userId :{type: Number, required: true},
    eventId:{type: Number, required: true},
    eventType : {type: String, required: true},
    notificationType :{
        type: String, required: true,
        enum :['email', 'sms', 'in-app']
    },
    eventPriority:{
        type: String, required: true,
        enum :['low' , 'high']
    },
    status :{
        type: String, required: true,
        enum :['pending' , 'sent']
    }
},{timestamps:true})

NotificationSchema.index({userId:1,eventId:1,notificationType:1},{unique:true})

const NotificationData = mongoose.model<INotification>('notifications',NotificationSchema)
export default NotificationData;
