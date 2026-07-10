import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import toast from "react-hot-toast";
import api from "../../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/forgot-password", {
        email,
      });

      toast.success(
        response.data.message || "Password reset link sent to your email."
      );

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Unable to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">

          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#111111]">
              Forgot Password
            </h1>

            <p className="mt-3 text-gray-500">
              Enter your registered email address and we'll send you a password
              reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#C9A227]">
                <FiMail className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-4 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-[#C9A227] disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="font-semibold text-[#C9A227] hover:underline"
            >
              ← Back to Login
            </Link>
          </div>

        </div>
      </section>
    </MainLayout>
  );
}

export default ForgotPassword;