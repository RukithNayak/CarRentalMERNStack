import express from "express";
import { deleteBookingById, getBookingsByUser, updateFeedback } from "../controllers/bookingController.js";

const router = express.Router();

router.get("/user/:userId", getBookingsByUser);
router.delete("/:id", deleteBookingById);
router.put("/:bookingId/feedback", updateFeedback);


export default router;
