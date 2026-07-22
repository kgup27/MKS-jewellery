import { FaTimes } from "react-icons/fa";

function UserDetailsModal({
  open,
  onClose,
  user,
}) {
  if (!open || !user) return null;

  // Safe fallback values for API data
  const name = user.name || "N/A";
  const email = user.email || "N/A";
  const phone = user.phone || "N/A";
  const orders = user.orders ?? 0;
  const totalSpent = Number(user.totalSpent) || 0;
  const status = user.status || "Active";
  
  const joined = user.created_at
  ? new Date(user.created_at).toLocaleDateString("en-IN")
  : "N/A";
  
  // Create initials if avatar is not available
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";

      case "vip":
        return "bg-purple-100 text-purple-700";

      case "blocked":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5">

          <div>
            <h2 className="text-2xl font-bold">
              Customer Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customer ID : #{user.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}
        <div className="grid gap-8 p-8 lg:grid-cols-3">

          {/* Left */}
          <div className="rounded-2xl border p-6 text-center">

            {user.avatar || user.profile_image ? (
              <img
                src={user.avatar || user.profile_image}
                alt={name}
                className="mx-auto h-32 w-32 rounded-full object-cover"
              />
            ) : (
              
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-600">
                {initials}
              </div>
            )}

            <h3 className="mt-5 text-2xl font-bold">
              {name}
            </h3>

            <span
              className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                status
              )}`}
            >
              {status}
            </span>

          </div>

          {/* Right */}
          <div className="space-y-6 lg:col-span-2">

            {/* Personal Information */}
            <div className="rounded-2xl border p-6">

              <h3 className="mb-5 text-xl font-semibold">
                Personal Information
              </h3>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <h4 className="font-semibold">
                    {name}
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <h4 className="font-semibold">
                    {email}
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <h4 className="font-semibold">
                    {phone}
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Joined
                  </p>

                  <h4 className="font-semibold">
                    {joined}
                  </h4>
                </div>

              </div>

            </div>

            {/* Statistics */}
            <div className="grid gap-5 md:grid-cols-3">

              <div className="rounded-2xl border bg-gray-50 p-5 text-center">

                <h4 className="text-3xl font-bold text-[#C9A227]">
                  {orders}
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Total Orders
                </p>

              </div>

              <div className="rounded-2xl border bg-gray-50 p-5 text-center">

                <h4 className="text-3xl font-bold text-[#C9A227]">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Total Spent
                </p>

              </div>

              <div className="rounded-2xl border bg-gray-50 p-5 text-center">

                <h4 className="text-3xl font-bold text-[#C9A227]">
                  {status}
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Account Status
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        
        <div className="flex justify-end border-t px-8 py-5">

          <button
            onClick={onClose}
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b08d1f]"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default UserDetailsModal;