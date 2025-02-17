import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    fueltype: {
        type: String,
        required: true
    },
    mileage: {
        type: String,
        required: true
    },
    photos: {
        type: [String],
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    availableCount: {
        type: Number,
        required: true,
        default: 1
    },
    reservedCount: {
        type: Number,
        default: 0
    },
    reservations: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Booking"
    }
});

export default mongoose.model("Car", CarSchema);
