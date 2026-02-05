const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

/* ===============================
   APPROVE LISTING
================================ */
router.put("/approve/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "approved", adminMessage: "" },
      { new: true }
    );

    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   REQUEST MORE INFO
================================ */
router.put("/needs-info/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        status: "needs_info",
        adminMessage: req.body.adminMessage
      },
      { new: true }
    );

    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
