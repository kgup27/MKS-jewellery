import OrderRow from "../OrderRow/OrderRow";

function OrdersTable({
  orders,
  loading,
  onView,
  onStatus,
  onInvoice,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-[#F8F6F2]">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Order ID
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-500"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.order_id}
                  order={order}
                  onView={onView}
                  onStatus={onStatus}
                  onInvoice={onInvoice}
                />
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default OrdersTable;