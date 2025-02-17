//@ts-nocheck
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./feedback.css";

const Feedback = ({ bookingId, carId, setOpen }) => {
    console.log("Feedback component rendered");

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!rating || !feedback) {
      alert("Please provide both rating and feedback.");
      return;
    }
  
    console.log(`Booking ID: ${bookingId}, Car ID: ${carId}`);
    console.log("Submitting feedback:", { rating, feedback });
  
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:8800/api/bookings/${bookingId}/feedback`,
        { rating, feedback }
      );
      console.log("Response from server:", response.data);
  
      alert("Feedback submitted successfully!");
      setOpen(false); // Close the feedback modal
      navigate(`/car/${carId}`); // Redirect to the car page
    } catch (err) {
      console.error("Error submitting feedback:", err.response || err);
      alert(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="feedback">
      <div className="feedbackContainer">
        <span className="feedbackTitle">Give Your Feedback</span>
        <textarea
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="rating">
          <label>Rating (1-5): </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
          />
        </div>
        <button
          className="submitButton"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

export default Feedback;
