import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; 
import MainLayout from "../../layouts/MainLayout";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import toast from "react-hot-toast";
import api from "../../../services/api"; 

function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useCustomerAuth();

  // Form states handling 
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
  });

  // Fetch Live Profile Data on Mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/auth/profile");
      
      setFormData({
        name: response.data.full_name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        city: response.data.city || "",
        address: response.data.address || "",
      });
    } catch (error) {
      console.error("FETCH PROFILE ERROR:", error);
      toast.error("Failed to load profile");
    }
  };

  // Async Profile Data Mutation Engine
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      await api.put("/api/auth/profile", {
        full_name: formData.name,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      toast.error(
        error.response?.data?.error || "Profile update failed"
      );
    }
  };

  // ✅ STEP 5: Fully Integrated Backend Customer Logout Handler
  const handleLogout = async () => {
    try {
      // Backend api context clean hit
      await api.post("/api/auth/logout");
      
      // Local context/storage update clean-up
      logout();
      
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      toast.error(
        error.response?.data?.error || "Logout failed"
      );
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold">My Account</h1>
          <p className="mt-3 text-gray-500">
            Manage your profile and account settings.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-4">
            {/* Sidebar Controls */}
            <div className="rounded-3xl bg-white p-6 shadow h-fit">
              <Link
                to="/profile"
                className="block w-full rounded-xl bg-black py-3 text-center text-white font-medium"
              >
                Profile
              </Link>

              <Link
                to="/orders"
                className="mt-4 block w-full rounded-xl border py-3 text-center font-medium transition hover:bg-[#C9A227] hover:text-white"
              >
                My Orders
              </Link>

              <Link
                to="/saved-address"
                className="mt-4 block w-full rounded-xl border py-3 text-center font-medium transition hover:bg-[#C9A227] hover:text-white"
              >
                Saved Address
              </Link>

              <button
                onClick={handleLogout}
                className="mt-4 w-full rounded-xl border border-red-500 py-3 text-red-500 font-medium transition hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </div>

            {/* Profile Forms Block */}
            <div className="lg:col-span-3 rounded-3xl bg-white p-8 shadow">
              <h2 className="text-3xl font-bold">Personal Information</h2>

              <form onSubmit={handleSaveChanges}>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    className="rounded-xl border p-4 bg-gray-50 text-gray-400 outline-none cursor-not-allowed"
                    disabled
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />

                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />
                </div>

                <textarea
                  rows="5"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-6 w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />

                <button
                  type="submit"
                  className="mt-8 rounded-xl bg-black px-8 py-4 font-semibold text-white transition hover:bg-[#C9A227]"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Profile;