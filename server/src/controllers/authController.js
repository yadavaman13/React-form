import bcrypt from "bcrypt";
import User from "../models/User.js";
import { uploadToImageKit } from "../config/imagekit.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      age,
      dob,
      gender,
      country,
      accountType,
      skills,
      bio,
      experience,
      themeColor,
      termsAccepted
    } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // 2. Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Upload files to ImageKit (if provided in multipart request)
    let profileImage = null;
    let resume = null;

    if (req.files?.profileImage?.[0]) {
      profileImage = await uploadToImageKit(req.files.profileImage[0]);
    }
    if (req.files?.resume?.[0]) {
      resume = await uploadToImageKit(req.files.resume[0]);
    }

    // 5. Safely parse skills array from FormData
    const parsedSkills = typeof skills === "string" ? JSON.parse(skills) : (skills || []);

    // 6. Save user to MongoDB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone,
      age: age ? Number(age) : undefined,
      dob: dob || undefined,
      gender,
      country,
      accountType,
      skills: parsedSkills,
      bio,
      experience: experience ? Number(experience) : 0,
      themeColor,
      termsAccepted: termsAccepted === "true" || termsAccepted === true,
      profileImage,
      resume
    });

    // 7. Return success response (never return password)
    return res.status(201).json({
      message: "Registration successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage?.url,
        resume: user.resume?.url
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: error.message || "Registration failed" });
  }
};
