require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./admin"); // same folder

async function createAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB connected");

    const email = "admin@jaadlogistics.com";
    const password = "admin123";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword
    });

    console.log("✅ Admin created successfully");
    console.log("👉 Login details:");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR CREATING ADMIN:", err);
    process.exit(1);
  }
}

createAdmin();
