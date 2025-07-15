import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ImageWithFallback from "../components/ImageWithFallback";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl md:text-3xl font-medium">My Orders</p>
      </div>

      {myOrders.length === 0 && (
        <p className="mt-8 text-gray-500">You have no orders yet.</p>
      )}

      {myOrders.map((order, index) => (
        <div
          key={index}
          className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between items-center gap-6 text-sm md:text-base">
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total: ₹{order.amount}</span>
          </p>

          {order.items.map((item, idx) => {
            const product = item.product;

            return (
              <div
                key={idx}
                className={`relative bg-white text-gray-800/70 ${
                  order.items.length !== idx + 1 ? "border-b" : ""
                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 w-full max-w-4xl`}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-24 h-24 rounded flex items-center justify-center">
                    <ImageWithFallback
                      src={
                        product?.image?.length > 0
                          ? `http://localhost:5000/images/${product.image[0]}`
                          : null
                      }
                      productName={product?.name}
                      companyName={product?.company}
                      category={product?.category}
                      size={96}
                      className="rounded object-cover w-24 h-24"
                    />
                  </div>

                  <div className="ml-4">
                    <h2 className="text-xl font-medium">{product?.name || "Unnamed Product"}</h2>
                    <p className="text-sm text-gray-500">{product?.category || "N/A"}</p>
                  </div>
                </div>

                <div className="text-sm md:text-base font-medium space-y-1">
                  <p>Qty: {item.quantity || 1}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <p className="text-sm md:text-base font-medium text-right">
                  ₹{product?.offerPrice * item.quantity || 0}
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
