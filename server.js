require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const snippetRoutes = require("./routes/snippetRoutes");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests

const corsOptions = {
  origin: "*", // Replace with your frontend domain
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: "Content-Type, Authorization", //allow these headers.
};

app.use(cors(corsOptions)); // Enable CORS

// Routes
app.use("/api/auth", authRoutes); // User Authentication Routes
app.use("/api/snippets", snippetRoutes); // Code Snippet Routes

// Default Route
app.get("/", (req, res) => {
  res.send("AI-Powered Snippet Manager API is running...");
});

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
