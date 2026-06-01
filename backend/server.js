const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const errorHandler = require("./src/middleware/errorHandler");
const settingsRoutes = require("./src/routes/settingsRoutes");
const wilayahRoutes = require("./src/routes/wilayahRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ADUIN Backend" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ADUIN Backend running on port ${PORT}`);
});

app.use("/api/wilayah", wilayahRoutes);