import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../service/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);
      // Save logged in user in localStorage
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-black p-6 rounded space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && (
          <p className="border border-black p-2 text-center text-sm font-semibold">
            {error}
          </p>
        )}

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
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-black p-2 rounded"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded font-semibold hover:bg-gray-800 disabled:bg-gray-400 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
