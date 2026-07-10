import {
  FaSearch,
  FaBell,
  FaMoon,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../../services/api";
import toast from "react-hot-toast";

function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");

      logout();

      toast.success("Logged out successfully");

      navigate("/admin/login");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Logout failed"
      );
    }
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">

      {/* Search */}
      <div className="relative w-96">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-[#C9A227]"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        <button className="rounded-full p-3 transition hover:bg-gray-100">
          <FaMoon size={18} />
        </button>

        <button className="relative rounded-full p-3 transition hover:bg-gray-100">
          <FaBell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <FaUserCircle
            size={40}
            className="text-[#C9A227]"
          />

          <div>
            <h3 className="font-semibold">Admin</h3>
            <p className="text-sm text-gray-500">
              Super Admin
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        >
          <FaSignOutAlt />
        </button>

      </div>
    </header>
  );
}

export default Topbar;