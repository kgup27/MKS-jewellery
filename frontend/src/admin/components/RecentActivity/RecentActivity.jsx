import {
  FaBagShopping,
  FaGem,
  FaUsers,
  FaWarehouse,
  FaTruck,
} from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";

// Centralized visual configuration based on activity type
const activityConfig = {
  order: {
    icon: FaBagShopping,
    color: "bg-green-100 text-green-600",
  },
  product: {
    icon: FaGem,
    color: "bg-yellow-100 text-yellow-600",
  },
  customer: {
    icon: FaUsers,
    color: "bg-blue-100 text-blue-600",
  },
  inventory: {
    icon: FaWarehouse,
    color: "bg-purple-100 text-purple-600",
  },
  shipping: {
    icon: FaTruck,
    color: "bg-red-100 text-red-600",
  },
};

function RecentActivity({ activities = [] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-500">
            Latest updates from your store
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No recent activity found.
          </div>
        ) : (
          activities.map((activity) => {
            // Fallback to 'order' config if type isn't recognized
            const config =
              activityConfig[activity.activity_type] || activityConfig.order;
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${config.color}`}
                >
                  <Icon size={18} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {activity.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activity.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentActivity;