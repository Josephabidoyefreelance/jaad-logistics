const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
    },

    ownerPhone: {
      type: String,
      required: true,
    },

    ownerEmail: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "needs_info"],
      default: "pending",
    },

    adminMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
