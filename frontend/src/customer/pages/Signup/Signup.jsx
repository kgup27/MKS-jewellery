import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import api from "../../../services/api";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/signup",
        {
          full_name: fullName,
          email,
          password,
        }
      );

      toast.success(
        response.data.message || "Account created successfully"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#111111]">
              Create Account
            </h1>

            <p className="mt-3 text-gray-500">
              Join MK Jewellers today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="mt-10 space-y-6">

            {/* Full Name */}
            <div>
              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 focus-within:border-[#C9A227] transition">
                <FiUser className="text-gray-500" />

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-4 outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block font-medium">
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 focus-within:border-[#C9A227] transition">
                <FiMail className="text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-4 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-medium">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 focus-within:border-[#C9A227] transition">
                <FiLock className="text-gray-500" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full px-3 py-4 outline-none"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block font-medium">
                Confirm Password
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 px-4 focus-within:border-[#C9A227] transition">
                <FiLock className="text-gray-500" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3 py-4 outline-none"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-[#C9A227] disabled:bg-gray-400"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-[#C9A227] hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </section>
    </MainLayout>
  );
}

export default Signup;