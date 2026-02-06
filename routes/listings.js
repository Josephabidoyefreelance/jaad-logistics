const express = require("express");
const router = express.Router();
const multer = require("multer");
const Listing = require("../models/Listing");

/* =========================
   MULTER CONFIG (UPLOADS)
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { files: 10 }
});

/* =========================
   CREATE LISTING
========================= */
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => f.filename) : [];

    const listing = new Listing({
      ownerName: req.body.ownerName,
      ownerPhone: req.body.ownerPhone,
      ownerEmail: req.body.ownerEmail,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      pricePerDay: req.body.pricePerDay,
      images,
      status: "pending",
      adminMessage: ""
    });

    await listing.save();

    res.json({ success: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* =========================
   GET APPROVED LISTINGS
========================= */
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find({ status: "approved" })
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch {
    res.status(500).json({ error: "Failed to load listings" });
  }
});

/* =========================
   GET ADMIN LISTINGS
========================= */
router.get("/admin", async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch {
    res.status(500).json({ error: "Failed to load admin listings" });
  }
});

/* =========================
   UPDATE STATUS
========================= */
router.put("/:id/status", async (req, res) => {
  try {
    const { status, adminMessage } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status, adminMessage: adminMessage || "" },
      { new: true }
    );

    res.json({ success: true, listing });
  } catch {
    res.status(500).json({ error: "Status update failed" });
  }
});

module.exports = router;
