import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react"; 
import MainLayout from "../../layouts/MainLayout";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import toast from "react-hot-toast";
import api from "../../../services/api"; 

function Profile() {
  const navigate = useNavigate();
  const { logout } = useCustomerAuth();

  // Core UX States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Form Fields State (Step 1: profile_image removed)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India", // Set default for initial render
  });

  // Memoized profile fetcher (Step 2: profile_image assignment removed)
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/auth/profile");
      
      setFormData({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address_line1: response.data.address_line1 || "",
        address_line2: response.data.address_line2 || "",
        city: response.data.city || "",
        state: response.data.state || "",
        pincode: response.data.pincode || "",
        country: response.data.country || "India", 
      });
    } catch (error) {
      console.error("FETCH PROFILE ERROR:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  // Safe side-effect integration
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Profile Data Mutation Engine
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Client-Side Validation Engine
    if (!formData.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }
    
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      toast.error("Enter a valid 6-digit pincode");
      return;
    }

    setSaving(true); 
    try {
      // Step 3: profile_image payload entry removed
      await api.put("/api/auth/profile", {
        full_name: formData.full_name,
        phone: formData.phone,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
      });

      await fetchProfile();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      toast.error(
        error.response?.data?.error || "Profile update failed"
      );
    } finally {
      setSaving(false); 
    }
  };

  // Backend Customer Logout Handler
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/api/auth/logout");
      logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      toast.error(
        error.response?.data?.error || "Logout failed"
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // Early Return Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-medium text-gray-600">Loading Profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

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
                disabled={loggingOut}
                className="mt-4 w-full rounded-xl border border-red-500 py-3 text-red-500 font-medium transition hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>

            {/* Profile Forms Block */}
            <div className="lg:col-span-3 rounded-3xl bg-white p-8 shadow">
              <h2 className="text-3xl font-bold">Personal Information</h2>

              {/* Step 4: Profile Image Preview container removed from here */}

              <form onSubmit={handleSaveChanges}>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {/* Full Name */}
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                    required
                  />

                  {/* Email */}
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    className="rounded-xl border p-4 bg-gray-50 text-gray-400 outline-none cursor-not-allowed"
                    disabled
                  />

                  {/* Phone Number */}
                  <input
                    type="tel"
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />

                  {/* City */}
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />
                </div>

                {/* Address Inputs */}
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="mt-6 w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />

                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                  className="mt-6 w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />

                {/* Geo Fields Grid */}
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  {/* State */}
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />

                  {/* Pincode */}
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />

                  {/* Country */}
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />
                </div>

                {/* Step 5: Profile Image URL Input Field removed from here */}

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-8 rounded-xl bg-black px-8 py-4 font-semibold text-white transition hover:bg-[#C9A227] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
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