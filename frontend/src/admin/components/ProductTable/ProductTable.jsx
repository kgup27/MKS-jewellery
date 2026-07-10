import ProductRow from "../ProductRow/ProductRow";

function ProductTable({
  products,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#F8F6F2]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : !products || products.length === 0 ? ( // Safe check: handles null, undefined, or empty array
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No Products Found
                </td>
              </tr>
            ) : (
              products?.map((product) => ( // Optional chaining for extra safety
                <ProductRow
                  key={product.id}
                  product={product}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;