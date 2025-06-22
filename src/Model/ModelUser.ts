
import mongoose from "mongoose";

interface Preferance {
    eventType : string;
    notificationType: string[]
}

interface IUser extends mongoose.Document {
    id : number;
    name: string;
    email: string;
    mobNo?:string;
    notificationPreferences : Preferance[];
    createdAt?: Date;
    updatedAt?: Date;
}

// user creation schema
const UserSchema = new mongoose.Schema<IUser>({
    
    id:{type:Number,required:true,unique:true},
    name: {type:String,required:true},
    email: {type:String,required:true},
    mobNo: {type:String},
    notificationPreferences:[{
        eventType: {type:String,required:true},
        notificationType: [{type:String,
            required:true,
            enum:['email', 'sms', 'in-app']
        }]
    }]
},{timestamps:true})

const Userdata = mongoose.model<IUser>('users',UserSchema)
export default Userdata;