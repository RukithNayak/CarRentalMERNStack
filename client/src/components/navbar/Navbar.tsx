//@ts-nocheck
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from localStorage
    dispatch({ type: "LOGOUT" }); // Dispatch logout action
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">EasyRentals</span>
        </Link>
        {user ? (
          <div className="navItems">
            <span className="username">Hello, {user.username}</span>
            <Link to="/bookings" style={{ textDecoration: "none" }}>
              <button className="navButton bookingsButton">Bookings</button>
            </Link>
            <button className="navButton logoutButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register">
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
