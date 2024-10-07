const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT is not set
const frontend_url = process.env.FRONTEND_URL;
const corsOptions = {
  origin: frontend_url,
};

// Initialize Express app
const app = express();
app.use(cors(corsOptions));

// List of stores
const stores = require("./stores"); // Ensure this is an array of store objects

// Get all stores
app.get("/api/stores", (req, res) => {
  if (!stores || stores.length === 0) {
    return res.status(404).json({ message: "No stores found." });
  }
  res.json(stores);
});

// Home page
app.get("/", (req, res) => {
  res.send("<h1>Welcome to APT for Store Delivery Zone Check</h1>");
});

// Start the server
app.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
});
