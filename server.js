const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const errorHandler = require("./middleware/errorHandler");

// load environment variables
dotenv.config();

// initialize express app
const app = express();

// connect to MongoDB
connectDB();

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://your-frontend.vercel.app", // later after frontend deploy
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/employees", employeeRoutes);

// health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
    timestamp: new Date().toISOString(),
  });
});

// error handling middleware (must be last)
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
