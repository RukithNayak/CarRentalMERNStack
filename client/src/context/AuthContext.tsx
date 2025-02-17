//@ts-nocheck
import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: { ...action.payload, isAdmin: action.payload.isAdmin },  // Ensure isAdmin is included
        loading: false,
        error: null,
      };

    case "REGISTER_SUCCESS":
      console.log(`${action.type} - User Data:`, action.payload); // Log the user data
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Log state.user every time it changes
  useEffect(() => {
    console.log("State updated - User:", state.user); // Log the user when it changes
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user)); // Save user to localStorage
    } else {
      localStorage.removeItem("user"); // Remove user from localStorage if logged out
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAdmin: state.user?.isAdmin || false, // Expose isAdmin explicitly
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
