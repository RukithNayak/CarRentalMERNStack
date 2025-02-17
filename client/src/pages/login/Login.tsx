//@ts-nocheck
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Handle login click event
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
  
    try {
      // Send login request to the backend
      const res = await axios.post("http://localhost:8800/api/auth/login", credentials);
      
      // Dispatch login success and save user data in AuthContext
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  
      // Save the token in localStorage after a successful login
      localStorage.setItem("token", res.data.token);
  
      // Redirect based on user role
      if (res.data.isAdmin) {
        navigate("/admin"); // Redirect to admin page if user is admin
      } else {
        navigate("/"); // Redirect to homepage if user is not admin
      }
    } catch (err) {
      console.error("Login Error:", err); // Log any errors for debugging
      const errorMsg = err.response ? err.response.data : err.message;
      dispatch({ type: "LOGIN_FAILURE", payload: errorMsg });
    }
  };


  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        {error && <span className="error-message">{error}</span>} {/* Show error message */}
      </div>
    </div>
  );
};

export default Login;
