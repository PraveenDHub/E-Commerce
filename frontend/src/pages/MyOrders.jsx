import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../features/products/orderSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Package, Eye, Calendar, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "completed")
      return order.orderStatus.toLowerCase() === "delivered";
    if (filter === "cancelled")
      return order.orderStatus.toLowerCase() === "cancelled";
    return true;
  });

  const handleCancel = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.patch(`/api/v1/order/${id}/cancel`);
      toast.success("Order cancelled successfully");
      dispatch(getMyOrders());
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">Track and manage your orders</p>
          </div>
          <div className="text-sm text-gray-500 mt-2 md:mt-0">
            {orders.length} Total Orders
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 bg-white p-2 rounded-3xl w-fit shadow-sm border border-gray-100">
          {["all", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-2xl font-medium transition-all capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f === "all" ? "All Orders" : f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">No orders found</p>
            <p className="text-gray-400 mt-2">Try changing the filter</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/order/${order._id}`)}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center px-8 pt-6 pb-4 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`px-5 py-2 rounded-2xl font-medium text-sm ${
                        order.orderStatus.toLowerCase() === "delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.orderStatus.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.orderStatus}
                    </div>

                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="px-8 py-6">
                  {order.orderItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-5 py-4 border-b last:border-none"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-gray-50 flex justify-between items-center border-t">
                  <div>
                    {order.orderStatus !== "Delivered" &&
                      order.orderStatus !== "Cancelled" && (
                        <button
                          onClick={(e) => handleCancel(order._id, e)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Order
                        </button>
                      )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{order.totalPrice}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;