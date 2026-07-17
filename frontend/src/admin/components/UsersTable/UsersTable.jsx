import UserRow from "../UserRow/UserRow";

function UsersTable({
  customers,
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

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Phone
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Orders
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Total Spent
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Joined
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
                  colSpan="8"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Loading customers...
                </td>
              </tr>

            ) : customers.length === 0 ? (

              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No customers found.
                </td>
              </tr>

            ) : (

              customers.map((user) => (

                <UserRow
                  key={user.id}
                  user={user}
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

export default UsersTable;