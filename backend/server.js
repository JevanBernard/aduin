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
  "https://aduin.vercel.app", // ← ganti dengan URL Vercel frontend kamu
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

app.listen(PORT, () => {
  console.log(`ADUIN Backend running on port ${PORT}`);
});