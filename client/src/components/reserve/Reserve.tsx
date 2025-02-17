//@ts-nocheck
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { DateRange } from "react-date-range";
import { SearchContext } from "../../context/SearchContext";

const Reserve = ({ setOpen, carId }) => {
  const { data, loading, error } = useFetch(`http://localhost:8800/api/cars/find/${carId}`);
  const { user } = useContext(AuthContext);
  const { dates, dispatch } = useContext(SearchContext);

  const [bookingId, setBookingId] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Fixed missing definition

  const defaultDates = dates.length
    ? dates
    : [
      {
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        key: "selection",
      },
    ];

  const handleReserve = async () => {
    const { startDate, endDate } = defaultDates[0];

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start and end dates.");
      setSuccessMessage("");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorMessage("Start date cannot be after the end date.");
      setSuccessMessage("");
      return;
    }

    if (!user) {
      setErrorMessage("You must be logged in to reserve a car.");
      setSuccessMessage("");
      return;
    }

    if (data.availableCount <= 0) {
      setErrorMessage("No cars available for this model.");
      setSuccessMessage("");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`http://localhost:8800/api/cars/${carId}/reserve`, {
        userId: user._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (res.data.bookingId) {
        setBookingId(res.data.bookingId);
        setSuccessMessage("Your reservation was successful!");
        setErrorMessage("");
      } else {
        setErrorMessage(res.data.message || "An error occurred while reserving the car.");
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Failed to reserve car:", err);
      setErrorMessage("An error occurred while reserving the car.");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!bookingId) {
      setErrorMessage("Booking ID is missing. Cannot submit feedback.");
      return;
    }

    if (!rating || rating < 1 || rating > 5 || !feedback.trim()) {
      setErrorMessage("Please provide a valid rating (1-5) and feedback.");
      return;
    }

    setIsSubmitting(true); // Start loading state
    try {
      const res = await axios.put(`http://localhost:8800/api/bookings/${bookingId}/feedback`, {
        rating,
        feedback,
      });

      if (res.status === 200) {
        setSuccessMessage("Your feedback has been submitted!");
        setErrorMessage("");
        setFeedback("");
        setRating(0);
        setIsFeedbackOpen(false); // Close the feedback form
      } else {
        setErrorMessage("An error occurred while submitting feedback.");
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setErrorMessage(
        err.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />

        {/* Show Feedback Form if Open */}
        {isFeedbackOpen ? (
          <div className="feedbackSection">
            <h3>Leave Feedback</h3>
            <div>
              <label>Rating(1 to 5): </label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => {
                  const value = Math.max(0, Math.min(5, Number(e.target.value)));
                  setRating(value);
                }}
              />
            </div>

            <div>
              <label>Feedback: </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            <button onClick={handleFeedbackSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
            <button onClick={() => setIsFeedbackOpen(false)}>Cancel</button>
          </div>
        ) : (
          <>
            {/* Car Details Section */}
            <span>Car Details:</span>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading car data.</p>
            ) : (
              <div className="rItem" key={data._id}>
                <div className="rItemInfo">
                  <div className="rTitle">{data.name}</div>
                  <div className="rType">Type: {data.type}</div>
                  <div className="rFuel">Fuel Type: {data.fueltype}</div>
                  <div className="rMileage">Mileage: {data.mileage}</div>
                  <div className="rPrice">Price: ₹{data.price}</div>
                  <div className="rStock">
                    Available Cars: <b>{data.availableCount}</b>
                  </div>
                </div>
              </div>
            )}

            {/* Reserve Button */}
            <button
              onClick={handleReserve}
              className="rButton"
              disabled={loading || isLoading || (data && data.availableCount <= 0)}
            >
              {isLoading ? "Reserving..." : "Reserve Now!"}
            </button>

            {/* Booking Confirmation */}
            {successMessage && (
              <div className="bookingConfirmation">
                <p>{successMessage}</p>
                {bookingId && <p>Booking ID: <strong>{bookingId}</strong></p>}
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="feedbackButton"
                >
                  Give Feedback
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="errorMessage">
                <p>{errorMessage}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

};

export default Reserve;
