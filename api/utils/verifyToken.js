import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received token:", token);  // Log the token here for debugging
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("Token verification failed:", err.message);  // Log any token verification errors
        return res.status(403).json({ message: "Invalid token!" });
      }
      req.user = user;  // Store the decoded user info
      next();
    });
  };
  




// User verification middleware
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};

// Admin verification middleware

export const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return next(createError(401, "Not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Invalid token!"));
    }

    if (!user.isAdmin) {
      return next(createError(403, "You are not authorized!"));
    }

    req.user = user;
    next();
  });
};

