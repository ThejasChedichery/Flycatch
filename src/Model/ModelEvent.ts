
import mongoose from "mongoose";

interface IEvent extends mongoose.Document {
    id: number;
    title: string;
    description: string;
    type: string;
    priority: 'low' | 'high';
    createdAt?: Date;
    updatedAt?: Date;
}

// event creation schema
const EventSchema = new mongoose.Schema<IEvent>({

    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'high']
    },
}, { timestamps: true })

const EventData = mongoose.model<IEvent>('events', EventSchema)
export default EventData;