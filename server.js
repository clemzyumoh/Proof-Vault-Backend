// // server.js
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// const authRoutes = require("./routes/authRoutes");

// app.use("/api/auth", authRoutes);

// const documentRoutes = require("./routes/documentRoutes");
// app.use("/api/docs", documentRoutes);

// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);



// app.use(require("./middleware/errorHandler"));

// // Routes (we'll add these next)
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// server.js
//const express = require("express");
import express from "express";
//const dotenv = require("dotenv");
import dotenv from "dotenv";
//const cors = require("cors");
import cors from "cors";
//const connectDB = require("./config/db");
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();


//app.use(cors());
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization", "x-wallet-address"],
    // Allow custom
    origin: "https://proof-vault.vercel.app/", // replace with actual domain
    credentials: true,
  })
);



// Middleware
//app.use(cors());
app.use(express.json());

// Routes
//const authRoutes = require("./routes/authRoutes");
import authRoutes from "./routes/authRoutes.js";
//const documentRoutes = require("./routes/documentRoutes");
import documentRoutes from "./routes/documentRoutes.js";
//import { initializeUploader } from "./controllers/documentController.js";
import ipfsRoutes from "./routes/ipfsRoutes.js";

app.use("/api/ipfs", ipfsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler (if defined, currently you said it's 'nothing')
//app.use(require("./middleware/errorHandler"));
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
