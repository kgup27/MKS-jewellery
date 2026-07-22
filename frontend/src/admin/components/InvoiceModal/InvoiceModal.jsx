import { FaTimes, FaPrint, FaDownload } from "react-icons/fa";
import adminApi from "../../../services/adminApi";

function InvoiceModal({ open, onClose, order }) {
  if (!open || !order) return null;

  const downloadInvoice = async () => {
    try {
      const orderId = order.order_id || order.id; 
      const response = await adminApi.get(
        `/api/admin/orders/${orderId}/invoice`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${orderId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice.");
    }
  };

  return (
   
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
   
      <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
   
          <div>
            <h2 className="text-3xl font-bold text-[#C9A227]">MK JEWELLERS</h2>
            <p className="text-sm text-gray-500">Premium Jewellery Collection</p>
          </div>
   
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        
        </div>

        {/* Invoice */}
        
        <div className="space-y-8 p-8">
          
          {/* Bill To & Invoice Info */}
          <div className="grid gap-8 md:grid-cols-2">
        
            <div>
              <h3 className="mb-3 text-xl font-semibold">Bill To</h3>

              <p className="font-semibold text-lg">
                {order.customer_name}
              </p>

              <p>{order.customer_email}</p>
              <p>{order.customer_phone}</p>

              <div className="mt-5">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Shipping Address
                </h4>

                <p>{order.shipping_address_line1}</p>
                <p>{order.shipping_address_line2}</p>
                <p>
                  {order.shipping_city}, {order.shipping_state}
                </p>
                <p>
                  {order.shipping_pincode}, {order.shipping_country}
                </p>
              </div>
            </div>
        
            <div className="text-right">
              <h3 className="mb-3 text-xl font-semibold">Invoice</h3>
              <p>
                <span className="font-semibold">Invoice :</span> INV-{order.order_id}
        
              </p>
        
              <p>
                <span className="font-semibold">Date :</span>{" "}
                {new Date(order.created_at).toLocaleDateString("en-IN")}
        
              </p>
              <p>
                <span className="font-semibold">Payment :</span>{" "}
                {order.payment_status?.charAt(0).toUpperCase() +
                 order.payment_status?.slice(1)}
              </p>
        
            </div>
        
          </div>

          {/* Table */}
         
          <div className="overflow-hidden rounded-xl border">
        
            <table className="min-w-full">
        
              <thead className="bg-[#F8F6F2]">
        
                <tr>
                  <th className="px-5 py-4 text-left">Product</th>
                  <th className="px-5 py-4 text-center">Qty</th>
                  <th className="px-5 py-4 text-center">Price</th>
                  <th className="px-5 py-4 text-center">Total</th>
                </tr>
    
              </thead>
              {/* Replaced old static tbody with dynamic items mapping */}
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.order_item_id} className="border-b last:border-b-0">
                    <td className="px-5 py-5">
                       <div className="flex items-center gap-4">

                         <img
                           src={item.image_url}
                           alt={item.title}
                           className="h-20 w-20 rounded-lg border object-cover"
                         />

                         <div>
                           <h4 className="font-semibold text-gray-900">
                             {item.title}
                           </h4>
                         </div>

                       </div>
                     </td>
                    <td className="px-5 py-5 text-center align-middle">
                      {item.quantity}
                    </td>

                    <td className="px-5 py-5 text-center align-middle">
                      ₹{Number(item.price_at_purchase).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-5 text-center font-semibold align-middle">
                      ₹{(
                        Number(item.price_at_purchase) * item.quantity
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            
            </table>
          
          </div>

          {/* Summary */}
          
          <div className="ml-auto w-full max-w-sm space-y-3">
            
            <div className="flex justify-between">
              
              <span>Subtotal</span>
              
              <span>
              
                ₹{Number(order.total_amount).toLocaleString("en-IN")}
             
              </span>
           
            </div>
          
            <div className="flex justify-between">
            
              <span>GST (3%)</span>
          
              <span>
                ₹{Math.round(Number(order.total_amount) * 0.03).toLocaleString("en-IN")}
              </span>
            
            </div>
            
            <div className="flex justify-between">
              
              <span>Shipping</span>

              <span>Free</span>

            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold text-[#C9A227]">
              
              <span>Total</span>
              
              <span>
                ₹{Math.round(Number(order.total_amount) * 1.03).toLocaleString("en-IN")}
              </span>
              
            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t px-8 py-5">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-gray-100"
          >
            <FaPrint />

            Print
            
          </button>
          <button
            onClick={downloadInvoice}
            className="flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white hover:bg-[#b08d1f]"
          >
            <FaDownload />

            Download PDF

          </button>

        </div>

      </div>
      
    </div>
  );
}

export default InvoiceModal;