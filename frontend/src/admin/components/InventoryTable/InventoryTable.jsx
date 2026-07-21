import InventoryRow from "../InventoryRow/InventoryRow";

function InventoryTable({
  inventory = [],
  loading = false,
  onView,
  onUpdate,
  onHistory,
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <p className="text-gray-500 font-medium">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#F8F6F2]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Category
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Stock
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Reserved
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Available
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Reorder Level
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <InventoryRow
                  key={item.product_id}
                  item={item}
                  onView={onView}
                  onUpdate={onUpdate}
                  onHistory={onHistory}
                />
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;