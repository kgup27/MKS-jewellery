import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import toast from "react-hot-toast";
import api from "../../../services/api";
// import { GoogleLogin } from "@react-oauth/google";

function LoginContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useCustomerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const from = location.state?.from?.pathname || "/";

  // Traditional Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;
      login(token, { id: user.id, email: user.email, name: user.full_name });
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Invalid email or password";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Success Handler
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post("http://localhost:3000/api/auth/google", {
  //       credential: credentialResponse.credential,
  //       clientId: credentialResponse.clientId,
  //     });

  //     const { token, user } = response.data;
      
  //     login(token, { id: user.id, email: user.email, name: user.name });
      
  //     toast.success(`Welcome, ${user.name}!`);
  //     navigate(from, { replace: true });
  //   } catch (error) {
  //     const errorMsg = error.response?.data?.error || "Google login verification failed";
  //     toast.error(errorMsg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <section className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#111111]">Welcome Back</h1>
          <p className="mt-3 text-gray-500">Login to your MK Jewellers account</p>
        </div>

        <form onSubmit={handleLogin} className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block font-medium text-gray-700">Email Address</label>
            <div className="flex items-center rounded-xl border border-gray-300 px-4 focus-within:border-[#C9A227] bg-white transition">
              <FiMail className="text-gray-400 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-4 outline-none text-gray-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">Password</label>
            <div className="flex items-center rounded-xl border border-gray-300 px-4 focus-within:border-[#C9A227] bg-white transition">
              <FiLock className="text-gray-400 shrink-0" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-4 outline-none text-gray-800"
                required
              />

                          <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-[#C9A227] transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm select-none text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-[#C9A227]" />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-[#C9A227] hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-[#C9A227] shadow-md active:scale-[0.99] disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* <div className="relative my-6">
            <hr className="border-gray-200" />
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-medium tracking-wider text-gray-400">
              OR
            </span>
          </div> */}

          {/* Corrected Google Button width setup */}
          {/* <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Sign-In Cancelled")}
              theme="outline"
              size="large"
              width="350" 
            />
          </div> */}
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-[#C9A227] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}

function Login() {
  return (
    <MainLayout>
      <LoginContent />
    </MainLayout>
  );
}

export default Login;
