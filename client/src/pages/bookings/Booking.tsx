//@ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");  // Redirects to the home page
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          throw new Error("User not authenticated.");
        }

        const res = await axios.get(`http://localhost:8800/api/bookings/user/${userId}`);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    try {
      const res = await axios.delete(`http://localhost:8800/api/bookings/${bookingId}`);
      if (res.status === 200) {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId)); // Update bookings list
      }
    } catch (err) {
      // Handle errors
      if (err.response && err.response.status === 404) {
        console.warn("Booking not found, removing from list.");
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        console.error("Error deleting booking:", err);
      }
    }
  };

  return (
    <div className="bookings">
      {/* Back button */}
      <button className="backButton" onClick={handleBack}>
        Back to Home
      </button>

      <h1>Your Bookings</h1>

      {/* Show error, loading state, or bookings */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => {
          const carName = booking?.car?.name || "Unknown Car"; // Safely access car name
          const startDate = new Date(booking.startDate).toLocaleDateString();
          const endDate = new Date(booking.endDate).toLocaleDateString();

          return (
            <div className="bookingCard" key={booking._id}>
              <h2>{carName}</h2>
              <p>
                <strong>Start Date:</strong> {startDate}
              </p>
              <p>
                <strong>End Date:</strong> {endDate}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Rating:</strong> {booking.rating || "Not rated yet"}
              </p>
              <p>
                <strong>Feedback:</strong> {booking.feedback || "No feedback provided"}
              </p>
              <button className="deleteButton" onClick={() => handleDelete(booking._id)}>
                Cancel Booking
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Booking;
