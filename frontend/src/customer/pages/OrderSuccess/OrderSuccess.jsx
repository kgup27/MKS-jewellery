import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";

function OrderSuccess() {
  const location = useLocation();

  const orderId = location.state?.orderId || 0;

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-3xl bg-white p-10 shadow-xl text-center">
          <FiCheckCircle
            size={90}
            className="mx-auto text-green-500"
          />

          <h1 className="mt-8 text-4xl font-bold">
            Order Placed Successfully 🎉
          </h1>

          <p className="mt-5 text-gray-600">
            Thank you for shopping with MK Jewellers.
            Your order has been placed successfully.
          </p>

          <div className="mt-8 rounded-2xl bg-[#FAF7F2] p-6">
            <p className="text-gray-500">
              Order ID
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              #MK{String(orderId).padStart(6, "0")}
            </h2>
          </div>

          <Link
            to="/shop"
            className="mt-10 block rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-[#C9A227]"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}

export default OrderSuccess;