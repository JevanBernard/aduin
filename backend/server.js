const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const wilayahRoutes = require("./src/routes/wilayahRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://aduin.vercel.app",
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/wilayah", wilayahRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ADUIN Backend" });
});

app.use(errorHandler);

// Vercel mengimpor app sebagai serverless function; listen hanya untuk lokal
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ADUIN Backend running on port ${PORT}`);
  });
}

module.exports = app;