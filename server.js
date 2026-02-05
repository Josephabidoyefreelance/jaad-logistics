require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const adminRoutes = require("./routes/admin");
const listingRoutes = require("./routes/listings");

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== STATIC FILES ===================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* OPTIONAL: if you later serve frontend from backend */
app.use(express.static(path.join(__dirname, "../jaad-frontend")));

/* ===================== DATABASE ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

/* ===================== ROUTES ===================== */
app.use("/api/admin", adminRoutes);
app.use("/api/listings", listingRoutes);

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
