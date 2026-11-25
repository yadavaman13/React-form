import { useState } from "react";
import { registerUser } from "../service/authService";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  age: "",
  dob: "",
  gender: "male",
  country: "India",
  accountType: "student",
  skills: [],
  bio: "",
  experience: 0,
  themeColor: "#000000",
  termsAccepted: false,
  profileImage: null,
  resume: null
};

const Register = () => {
  const [formData, setFormData] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Single unified handler for ALL input types
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0] || null;
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (name === "profileImage" && file) setPreview(URL.createObjectURL(file));
    } else if (type === "checkbox" && name === "termsAccepted") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val === null || val === "") return;
        payload.append(key, Array.isArray(val) ? JSON.stringify(val) : val);
      });

      const res = await registerUser(payload);
      setMessage(res.message || "Registration successful!");
      setFormData(initialForm);
      setPreview(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-lg border border-black p-6 rounded space-y-4">
        
        <h2 className="text-2xl font-bold text-center">Registration Form</h2>
        
        {message && (
          <p className="border border-black p-2 text-center text-sm font-semibold">
            {message}
          </p>
        )}

        {/* 1. Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
            placeholder="John Doe"
            required
          />
        </div>

        {/* 2. Email & 3. Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-black p-2 rounded"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              name="password"
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-black p-2 rounded"
              placeholder="Min 6 characters"
              required
            />
          </div>
        </div>

        {/* 4. Phone & 5. Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-black p-2 rounded"
              placeholder="9876543210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              min="1"
              max="100"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-black p-2 rounded"
              placeholder="21"
            />
          </div>
        </div>

        {/* 6. Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
          />
        </div>

        {/* 7. Gender (Radio) */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <div className="flex gap-6">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* 8. Country & 9. Account Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-black p-2 rounded bg-white"
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="w-full border border-black p-2 rounded bg-white"
            >
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>
        </div>

        {/* 10. Skills (Multi Checkbox) */}
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <div className="flex flex-wrap gap-4 border border-black p-3 rounded">
            {["React", "Node.js", "MongoDB", "Express"].map((skill) => (
              <label key={skill} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  name="skills"
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleChange}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        {/* 11. Bio (Textarea) */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            rows={2}
            value={formData.bio}
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
            placeholder="Tell us about yourself"
          />
        </div>

        {/* 12. Range & 13. Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">
              Experience: {formData.experience} years
            </label>
            <input
              type="range"
              name="experience"
              min="0"
              max="10"
              value={formData.experience}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Theme Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="themeColor"
                value={formData.themeColor}
                onChange={handleChange}
                className="h-9 w-12 border border-black p-0 cursor-pointer rounded"
              />
              <span className="text-sm font-mono">{formData.themeColor}</span>
            </div>
          </div>
        </div>

        {/* 14. Profile Image & 15. Resume (ImageKit) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-xs"
            />
            {preview && (
              <img src={preview} alt="preview" className="w-12 h-12 rounded-full border border-black mt-2 object-cover" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resume (PDF)</label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="w-full text-xs"
            />
          </div>
        </div>

        {/* 16. Terms Accepted */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
            I accept the terms and conditions *
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded font-semibold hover:bg-gray-800 disabled:bg-gray-400 cursor-pointer"
        >
          {loading ? "Submitting..." : "Register"}
        </button>

      </form>
    </div>
  );
};

export default Register;
