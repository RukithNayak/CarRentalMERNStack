import express from 'express';
import multer from 'multer';
import {
  countByType,
  createCar,
  deleteCar,
  getCar,
  getCars,
  updateCar,
  getCarStock,
  updateCarStock,
  reserveCar,
  getAllCars,
} from "../controllers/car.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import upload from '../utils/upload.js'; // Multer configuration

const router = express.Router();

router.get("/find/:id", getCar);
router.get("/", getCars);
router.post("/", verifyAdmin, upload.array('photos', 6), createCar); // Handle file uploads
router.put("/:id", verifyAdmin, updateCar);
router.delete("/:id", verifyAdmin, deleteCar);
router.get("/countByType", countByType);
router.get("/:id/stock", getCarStock);
router.put("/:id/stock", updateCarStock);
router.post("/:id/reserve", reserveCar);
router.get("/all", verifyAdmin, getAllCars);

export default router;
