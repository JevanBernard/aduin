const express = require("express");
const cors = require("cors");
require("dotenv").config();

const reportRoutes = require("./src/routes/reportRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const authRoutes = require("./src/routes/authRoutes");
const mlRoutes = require("./src/routes/mlRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ml", mlRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ADUIN Backend", timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ADUIN Backend running on port ${PORT}`);
});
