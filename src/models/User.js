import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passcode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("passcode")) return next();
  this.passcode = await bcrypt.hash(this.passcode, 12);
  next();
});

UserSchema.methods.comparePasscode = async function (candidatePasscode) {
  return bcrypt.compare(candidatePasscode, this.passcode);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
