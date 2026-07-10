import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import api from "../../../services/api"; 
import toast from "react-hot-toast"; 
import { useAuth } from "../../context/AuthContext"; // <-- Step 1: Integrated AuthContext Import

function AdminLogin() {
  const navigate = useNavigate(); 
  const { login } = useAuth(); // <-- Step 2: Injected login method from Context Hook
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, admin } = response.data;

      // <-- Step 3 & 4: Deleted manual localStorage and hooked into global state wrapper
      login(token, admin);

      toast.success("Login Successful");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("ADMIN LOGIN CLIENT ERROR:", error);
      toast.error(
        error.response?.data?.error || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-200 p-8">
        
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/mk-logo.png"
            alt="MK Jewellers"
            className="mx-auto h-24 w-24 object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="mt-2 text-gray-500">
            Login to access MK Jewellers Admin Panel
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@mkjewellers.com"
                className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-[#C9A227]"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 outline-none transition focus:border-[#C9A227]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="accent-[#C9A227]"
              />
              Remember Me
            </label>
            <Link
              to="/admin/forgot-password"
              className="text-sm font-medium text-[#C9A227] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#C9A227] py-3 font-semibold text-white transition hover:bg-[#B08D1F] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MK Jewellers Admin Panel
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;