import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car", // Refers to the Car model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the User model
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    daysBooked: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending", 
    },
    rating: {
      type: Number,
      min: 1, // Minimum rating is 1 star
      max: 5, // Maximum rating is 5 stars
      default: null, // Optional field, default is null
    },
    feedback: {
      type: String,
      default: "", // Optional field, default is an empty string
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

export default mongoose.model("Booking", BookingSchema);
