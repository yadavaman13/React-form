import bcrypt from "bcrypt";
import User from "../models/User.js";
import { uploadToImageKit } from "../config/imagekit.js";

// Helper to format user response without sensitive password
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  age: user.age || "",
  dob: user.dob ? user.dob.toISOString().split("T")[0] : "",
  gender: user.gender || "male",
  country: user.country || "India",
  accountType: user.accountType || "student",
  skills: user.skills || [],
  bio: user.bio || "",
  experience: user.experience || 0,
  themeColor: user.themeColor || "#000000",
  termsAccepted: user.termsAccepted,
  profileImage: user.profileImage?.url || null,
  resume: user.resume?.url || null
});

// 1. REGISTER
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

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = null;
    let resume = null;

    if (req.files?.profileImage?.[0]) {
      profileImage = await uploadToImageKit(req.files.profileImage[0]);
    }
    if (req.files?.resume?.[0]) {
      resume = await uploadToImageKit(req.files.resume[0]);
    }

    const parsedSkills = typeof skills === "string" ? JSON.parse(skills) : (skills || []);

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

    return res.status(201).json({
      message: "Registration successful!",
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: error.message || "Registration failed" });
  }
};

// 2. LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful!",
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

// 3. GET USER DETAILS
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch user" });
  }
};

// 4. UPDATE USER (EDIT ALL FIELDS + RE-UPLOAD TO IMAGEKIT)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update normal fields
    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (phone !== undefined) user.phone = phone;
    if (age !== undefined && age !== "") user.age = Number(age);
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (country) user.country = country;
    if (accountType) user.accountType = accountType;
    if (bio !== undefined) user.bio = bio;
    if (experience !== undefined && experience !== "") user.experience = Number(experience);
    if (themeColor) user.themeColor = themeColor;
    if (termsAccepted !== undefined) user.termsAccepted = termsAccepted === "true" || termsAccepted === true;

    if (skills) {
      user.skills = typeof skills === "string" ? JSON.parse(skills) : skills;
    }

    // If new password provided, re-hash it
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    // Upload new files to ImageKit if provided
    if (req.files?.profileImage?.[0]) {
      user.profileImage = await uploadToImageKit(req.files.profileImage[0]);
    }
    if (req.files?.resume?.[0]) {
      user.resume = await uploadToImageKit(req.files.resume[0]);
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};
