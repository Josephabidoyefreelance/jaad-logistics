const express = require("express");
const router = express.Router();
const multer = require("multer");
const Listing = require("../models/Listing");

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

/* =========================
   CREATE LISTING
========================= */
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const images = req.files.map(f => f.filename);

    const listing = new Listing({
      ownerName: req.body.ownerName,
      ownerPhone: req.body.ownerPhone,
      ownerEmail: req.body.ownerEmail,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      pricePerDay: req.body.pricePerDay,
      images
    });

    await listing.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* =========================
   GET APPROVED LISTINGS (FRONTEND)
========================= */
router.get("/", async (req, res) => {
  const listings = await Listing.find({ status: "approved" }).sort({ createdAt: -1 });
  res.json(listings);
});

/* =========================
   GET ALL LISTINGS (ADMIN)
========================= */
router.get("/admin", async (req, res) => {
  const listings = await Listing.find().sort({ createdAt: -1 });
  res.json(listings);
});

/* =========================
   UPDATE STATUS (🔥 FIX 🔥)
========================= */
router.put("/:id/status", async (req, res) => {
  try {
    const { status, adminMessage } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminMessage: adminMessage || ""
      },
      { new: true }
    );

    res.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Status update failed" });
  }
});

module.exports = router;
