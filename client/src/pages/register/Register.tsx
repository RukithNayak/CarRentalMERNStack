//@ts-nocheck
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./register.css"; 

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    email: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "REGISTER_START" }); 

    try {
      
      const res = await axios.post("http://localhost:8800/api/auth/register", credentials);
      console.log("Register Response:", res); // Log response data

      // On successful registration, dispatch REGISTER_SUCCESS and save the user in context
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });

      // Save the user data in localStorage just like login
      localStorage.setItem("user", JSON.stringify(res.data));

      // Navigate to the homepage after successful registration
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err); 
      const errorMsg = err.response ? err.response.data : err.message;
      dispatch({ type: "REGISTER_FAILURE", payload: errorMsg });
    }
  };

  return (
    <div className="register">
      <div className="rContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="rInput"
        />
        <button disabled={loading} onClick={handleClick} className="rButton">
          Register
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Register;
