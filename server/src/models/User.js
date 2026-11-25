import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: String,
    age: Number,
    dob: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    country: String,
    accountType: { type: String, default: "student" },
    skills: [String],
    bio: String,
    experience: { type: Number, default: 0 },
    themeColor: { type: String, default: "#2563eb" },
    profileImage: {
      url: String,
      fileId: String
    },
    resume: {
      url: String,
      fileId: String
    },
    termsAccepted: { type: Boolean, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
