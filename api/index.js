import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import carsRoute from "./routes/cars.js"
import bookingRoutes from "./routes/bookingRoutes.js";
import cors from "cors"
import path from "path"
const app = express()
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

app.get("/", (req, res) => {
    res.send("hello first request");
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});

const __dirname = path.resolve();

//middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/bookings", bookingRoutes);

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/cars", carsRoute);
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
})

app.listen(8800, () => {
    connect();
    console.log("Connected to backend");
})