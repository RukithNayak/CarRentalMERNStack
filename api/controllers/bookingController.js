import Booking from "../models/Booking.js";

export const getBookingsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const bookings = await Booking.find({ user: userId }).populate("car");

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while retrieving bookings." });
  }
};

export const deleteBookingById = async (req, res) => {
    const bookingId = req.params.id;
  
    try {
      const booking = await Booking.findByIdAndDelete(bookingId);
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
  
      try {
        const car = await Car.findById(booking.car);
        if (car) {
          car.availableCount += 1; // Increment car availability
          await car.save();
        }
      } catch (carError) {
        console.warn("Car availability update failed, but proceeding.");
      }
  
      res.status(200).json({ message: "Booking deleted successfully." });
    } catch (err) {
      console.error("Error deleting booking:", err);
      res.status(500).json({ message: "An error occurred while deleting the booking." });
    }
  };

export const updateFeedback = async (req, res) => {
  const { bookingId } = req.params;
  const { rating, feedback } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Update feedback and rating for the booking
    booking.rating = rating;
    booking.feedback = feedback;
    await booking.save();

    res.status(200).json({ message: "Feedback updated successfully!" });
  } catch (err) {
    console.error("Error updating feedback", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
