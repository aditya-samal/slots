import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true, // Format: "2025-05-31" or "2025-06-01"
    },
    time: {
      type: String,
      required: true, // Format: "15:00-15:30"
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    studentName: {
      type: String,
      default: null,
    },
    studentEmail: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

SlotSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.models.Slot || mongoose.model("Slot", SlotSchema);
