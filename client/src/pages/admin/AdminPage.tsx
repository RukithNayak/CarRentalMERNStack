//@ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";
import "./adminPage.css";

const AdminPage = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    name: "",
    type: "",
    fueltype: "",
    mileage: "",
    price: "",
    desc: "",
    availableCount: 1, // Default value for availability
    photos: [], // Array to store multiple images
  });
  const [error, setError] = useState("");

  // Fetch all cars from /api/cars
  const fetchCars = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError("Failed to fetch cars");
    }
  };

  // Call fetchCars on initial load
  useEffect(() => {
    fetchCars();
  }, []);

  const handleAddCar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("name", newCar.name);
      formData.append("type", newCar.type);
      formData.append("fueltype", newCar.fueltype);
      formData.append("mileage", newCar.mileage);
      formData.append("price", newCar.price);
      formData.append("desc", newCar.desc);
      formData.append("availableCount", newCar.availableCount);

      // Append the selected photos to FormData (each photo input separately)
      newCar.photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      // Send request to backend
      await axios.post("http://localhost:8800/api/cars", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form and re-fetch cars
      setNewCar({
        name: "",
        type: "",
        fueltype: "",
        mileage: "",
        price: "",
        desc: "",
        availableCount: 1,
        photos: [], // Clear photos after submission
      });
      fetchCars();
    } catch (err) {
      console.error("Error adding car:", err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : "Failed to add car");
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      await axios.delete(`http://localhost:8800/api/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Re-fetch the cars list after deletion
      fetchCars();
    } catch (err) {
      console.error("Error deleting car:", err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : "Failed to delete car");
    }
  };

  // Handle file input change (for image upload)
  const handleImageChange = (e, index) => {
    const updatedPhotos = [...newCar.photos];
    updatedPhotos[index] = e.target.files[0]; // Set file for the specific index
    setNewCar({ ...newCar, photos: updatedPhotos });
  };

  return (
    <div className="adminPage">
      <h1>Admin Panel</h1>

      {/* Add New Car Section */}
      <div className="addCar">
        <h2>Add New Car</h2>
        <input
          type="text"
          placeholder="Car Name"
          value={newCar.name}
          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Car Type"
          value={newCar.type}
          onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}
        />
        <input
          type="text"
          placeholder="Fuel Type"
          value={newCar.fueltype}
          onChange={(e) => setNewCar({ ...newCar, fueltype: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mileage"
          value={newCar.mileage}
          onChange={(e) => setNewCar({ ...newCar, mileage: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newCar.price}
          onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newCar.desc}
          onChange={(e) => setNewCar({ ...newCar, desc: e.target.value })}
        />
        <input
          type="number"
          placeholder="Available Count"
          value={newCar.availableCount}
          onChange={(e) =>
            setNewCar({ ...newCar, availableCount: e.target.value })
          }
        />

        {/* Separate Image Upload Inputs */}
        {[...Array(6)].map((_, index) => (
          <div key={index}>
            <label>Image {index + 1}</label>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, index)} // Handle each image separately
            />
          </div>
        ))}
        
        <button onClick={handleAddCar}>Add Car</button>
      </div>

      {/* Display List of Cars */}
      <div className="carList">
        <h2>All Cars</h2>
        {error && <p className="error">{error}</p>}
        <ul>
          {cars.map((car) => (
            <li key={car._id} className="carItem">
              <span>{car.name}</span>
              <span>{car.type}</span>
              <span>{car.fueltype}</span>
              <span>{car.mileage}</span>
              <span>{car.price}</span>
              <span>{car.availableCount}</span>
              {car.photos &&
                car.photos.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8800/${image}`}
                    alt={`Car Image ${index + 1}`}
                    width={100}
                    style={{ marginRight: "10px" }}
                  />
                ))}
              <button onClick={() => handleDeleteCar(car._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
