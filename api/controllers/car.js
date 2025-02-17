import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import upload from "../utils/upload.js";

export const createCar = async (req, res) => {
  try {
    const { name, type, fueltype, mileage, price, desc, availableCount } = req.body;
    const photos = req.files.map(file => `uploads/${file.filename}`);

    const newCar = new Car({
      name,
      type,
      fueltype,
      mileage,
      price,
      desc,
      availableCount,
      photos,
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ message: "Error uploading image", error: err.message });
  }
};

export const updateCar = async (req, res, next) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedCar);
    } catch (err) {
        next(err);
    }
}

export const deleteCar = async (req, res, next) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.status(200).json("Car has been deleted");
    } catch (err) {
        next(err);
    }
}

export const getCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        res.status(200).json(car);
    } catch (err) {
        next(err);
    }
}

export const getCars = async (req, res, next) => {
    const { min, max, limit, ...others } = req.query;
    
    try {
        const filter = {
            ...others,
            price: {
                $gte: min ? Number(min) : 0,
                $lte: max ? Number(max) : 9999999,
            },
        };

        const cars = await Car.find(filter).limit(Number(limit) || 10);

        res.status(200).json(cars);
    } catch (err) {
        next(err);
    }
};

export const getAllCars = async (req, res, next) => {
    try {
      const cars = await Car.find();
      res.status(200).json(cars);
    } catch (err) {
      next(err);
    }
};

export const countByType = async (req, res, next) => {
    try {
        const carCount = await Car.countDocuments({type:"car"});
        
        res.status(200).json([{type: "car", count: carCount}]);
    } catch(err) {
        next(err);
    }
};

export const getCarStock = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json({ availableCount: car.availableCount });
    } catch (err) {
        next(err);
    }
};

export const updateCarStock = async (req, res, next) => {
    try {
      const carId = req.params.id;
      const car = await Car.findById(carId);
  
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
  
      if (car.availableCount <= 0) {
        return res.status(400).json({ message: "No cars available for this model" });
      }
  
      car.availableCount -= 1;
      await car.save();
  
      res.status(200).json({ message: "Car reserved successfully", car });
    } catch (err) {
      next(err);
    }
};

export const reserveCar = async (req, res) => {
  const { userId, startDate, endDate, rating, feedback } = req.body; // Added rating and feedback
  const carId = req.params.id;

  try {
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysBooked = Math.ceil((end - start) / (1000 * 3600 * 24));

    if (car.availableCount <= 0) {
      return res.status(400).json({ message: "No cars available for this model." });
    }

    // Create a new booking with optional rating and feedback
    const newBooking = new Booking({
      car: carId,
      user: userId,
      startDate,
      endDate,
      daysBooked,
      status: "confirmed",
      rating: rating || null, // Set rating if provided
      feedback: feedback || "", // Set feedback if provided
    });

    const savedBooking = await newBooking.save();

    // Update car availability
    car.availableCount -= 1;
    await car.save();

    res.status(200).json({
      message: "Car reserved successfully!",
      bookingId: savedBooking._id,
      daysBooked: savedBooking.daysBooked,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while reserving the car." });
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

    booking.rating = rating || booking.rating;
    booking.feedback = feedback || booking.feedback;
    const updatedBooking = await booking.save();

    res.status(200).json({ message: "Feedback updated successfully!", updatedBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while updating feedback." });
  }
};

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
