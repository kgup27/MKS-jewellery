import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function SalesChart({ data = [] }) {
  const salesData = MONTH_NAMES.map((month, index) => {
    const item = data.find((d) => Number(d.month) === index + 1);

    return {
      month,
      sales: item ? Number(item.revenue) : 0,
    };
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Sales Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monthly Revenue Performance
          </p>
        </div>

        <button className="rounded-lg border border-[#C9A227] px-4 py-2 text-sm font-medium text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition">
          This Year
        </button>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A227" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#C9A227" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#C9A227"
              strokeWidth={3}
              fill="url(#salesColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesChart;