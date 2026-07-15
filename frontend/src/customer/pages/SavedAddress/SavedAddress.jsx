import { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";

function SavedAddress() {
  // States definition
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // DRY Refactoring: Helper function to reset form states
  const resetForm = () => {
    setEditingAddressId(null);
    setFormData({
      full_name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
  };

  // Fetch Addresses from Backend API
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/addresses");
      setAddresses(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  // handleAddAddress() function to submit form data
  const handleAddAddress = async () => {
    console.log("Before Submit:", formData);
    try {
      if (
        !formData.full_name ||
        !formData.phone ||
        !formData.address_line1 ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
      ) {
        return toast.error("Please fill all required fields.");
      }

      await api.post("/api/addresses", formData);
      toast.success("Address added successfully!");

      // Wait for Address List to refresh completely
      await fetchAddresses();

      // Cleaned: Form reset via helper
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to add address.");
    }
  };

  // handleDeleteAddress() function to remove an address
  const handleDeleteAddress = async (addressId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this address?"
      );

      if (!confirmDelete) return;

      await api.delete(`/api/addresses/${addressId}`);
      toast.success("Address deleted successfully!");

      // Wait for Address List to refresh completely
      await fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to delete address.");
    }
  };

  // handleSetDefault() function to set an address as default
  const handleSetDefault = async (addressId) => {
    try {
      await api.patch(`/api/addresses/${addressId}/default`);
      toast.success("Default address updated successfully!");

      // Wait for Address List to refresh completely
      await fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to update default address."
      );
    }
  };

  // handleEditAddress() function to populate form and scroll up
  const handleEditAddress = (address) => {
    setEditingAddressId(address.address_id);

    setFormData({
      full_name: address.full_name || "",
      phone: address.phone || "",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // handleUpdateAddress() function to update existing address data
  const handleUpdateAddress = async () => {
    try {
      if (
        !formData.full_name ||
        !formData.phone ||
        !formData.address_line1 ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
      ) {
        return toast.error("Please fill all required fields.");
      }

      setSaving(true);

      await api.put(`/api/addresses/${editingAddressId}`, formData);
      toast.success("Address updated successfully!");

      // Wait for Address List to refresh completely
      await fetchAddresses();

      // Cleaned: State reset via helper
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update address.");
    } finally {
      setSaving(false);
    }
  };

  // Hook to load data on mount
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Loading State UI
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
          <div className="text-xl font-semibold animate-pulse text-[#C9A227]">
            Loading Addresses...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold">Saved Addresses</h1>
          <p className="mt-3 text-gray-500">Manage your delivery addresses.</p>

          {/* E-commerce Style Flex Layout Container */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            
            {/* LEFT SIDE: Dynamic Address Cards container with flex-1 */}
            <div className="min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {addresses.length === 0 ? (
                  <div className="col-span-full rounded-3xl bg-white p-8 shadow flex items-center justify-center text-gray-400 min-h-[200px]">
                    No addresses saved yet.
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.address_id}
                      className="rounded-3xl bg-white p-8 shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">{address.full_name}</h2>
                          {address.is_default && (
                            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-6 text-gray-600 leading-8">
                          {address.address_line1}
                          <br />
                          {address.address_line2 && (
                            <>
                              {address.address_line2}
                              <br />
                            </>
                          )}
                          {address.city}, {address.state}
                          <br />
                          {address.country} - {address.pincode}
                          <br />
                          Phone : {address.phone}
                        </p>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-4">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="rounded-xl border border-[#C9A227] px-6 py-3 transition hover:bg-[#C9A227] hover:text-white"
                        >
                          Edit
                        </button>
                        
                        <button
                          onClick={() => handleDeleteAddress(address.address_id)}
                          className="rounded-xl border border-red-500 px-6 py-3 text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>

                        {!address.is_default && (
                          <button
                            onClick={() => handleSetDefault(address.address_id)}
                            className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-[#C9A227]"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT SIDE: Rigid 380px Wide Sticky Form */}
            <div className="w-full lg:w-[380px] lg:sticky lg:top-24 self-start rounded-3xl border-2 border-dashed border-gray-300 bg-white p-8 shadow">
              <h2 className="text-2xl font-bold">
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </h2>

              <div className="mt-8 space-y-5">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />

                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />

                <textarea
                  rows="3"
                  placeholder="Address Line 1 (House No, Building, Street) *"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />

                <input
                  type="text"
                  placeholder="Address Line 2 (Locality, Area - Optional)"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City *"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />

                  <input
                    type="text"
                    placeholder="State *"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />

                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                  />
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={editingAddressId ? handleUpdateAddress : handleAddAddress}
                  disabled={saving}
                  className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-[#C9A227] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingAddressId
                    ? "Update Address"
                    : "Save Address"}
                </button>

                {/* Cleaned: Cancel Button linking straight to resetForm */}
                {editingAddressId && (
                  <button
                    onClick={resetForm}
                    className="mt-3 w-full rounded-xl border border-gray-300 py-4 font-semibold transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default SavedAddress;