import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OrderTimeline from "../components/OrderTimeline.jsx";
import { motion } from "framer-motion";
import { MapPin, Package, Calendar, CreditCard } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(`/api/v1/order/${id}`);
      setOrder(data.order);
    };
    fetchOrder();
  }, [id]);

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500">Loading order details...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Order #{order._id.slice(-6)}
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Ordered on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div
            className={`px-7 py-3 rounded-3xl font-semibold text-lg shadow-sm ${
              order.orderStatus === "Delivered"
                ? "bg-emerald-100 text-emerald-700"
                : order.orderStatus === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {order.orderStatus}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-14 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10"
            >
              <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                <Package className="w-7 h-7 text-indigo-600" />
                Order Progress
              </h2>

              <OrderTimeline status={order.orderStatus} />

              {/* Status Message - FIXED with Cancelled handling */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`mt-8 text-center text-lg font-medium ${
                  order.orderStatus === "Cancelled"
                    ? "text-red-600"
                    : "text-gray-700"
                }`}
              >
                {order.orderStatus === "Delivered"
                  ? "🎉 Your order has been delivered successfully! Thank you for shopping with us."
                  : order.orderStatus === "Shipped"
                    ? "🚚 Your order is on the way! It should reach you soon."
                    : order.orderStatus === "Packed"
                      ? "📦 Your order is packed and ready for shipping."
                      : order.orderStatus === "Cancelled"
                        ? "❌ Your order has been cancelled."
                        : "🛒 Your order is being processed."}
              </motion.p>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold">Shipping Address</h2>
              </div>

              <div className="text-gray-700 text-[17px] leading-relaxed space-y-1">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>
                  {order.shippingAddress.country} -{" "}
                  {order.shippingAddress.pinCode}
                </p>
                <p className="pt-4 font-medium">
                  📱 {order.shippingAddress.phoneNo}
                </p>
              </div>
            </motion.div>

            {/* Ordered Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Ordered Items</h2>

              <div className="space-y-6">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-6 bg-gray-50 rounded-2xl p-6"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-xl shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right font-semibold text-xl">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Price Summary */}
          {/* Right Summary Panel */}
          <div className="lg:col-span-6">
            <div className="sticky top-8 space-y-6">
              {/* Premium Wrapper */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_20px_60px_-20px_rgba(99,102,241,0.25)] backdrop-blur-md"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-purple-100/60 blur-3xl" />

                <div className="relative p-8">
                  <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-gray-900">
                    <CreditCard className="h-6 w-6 text-indigo-600" />
                    Price Summary
                  </h2>

                  <div className="space-y-4 rounded-3xl bg-gray-50/80 p-5 ring-1 ring-gray-100">
                    <div className="flex items-center justify-between text-[16px]">
                      <span className="text-gray-600">Items Price</span>
                      <span className="font-semibold text-gray-900">
                        ₹{order.itemsPrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[16px]">
                      <span className="text-gray-600">Tax 18%</span>
                      <span className="font-semibold text-gray-900">
                        ₹{order.taxPrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[16px]">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-gray-900">
                        ₹{order.shippingPrice}
                      </span>
                    </div>

                    <div className="my-2 border-t border-dashed border-gray-200" />

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total Paid
                      </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        ₹{order.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.22)] backdrop-blur-md"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />
                <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-cyan-100/60 blur-3xl" />

                <div className="relative p-8">
                  <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-gray-900">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                    Payment Details
                  </h2>

                  <div className="space-y-4 rounded-3xl bg-gray-50/80 p-5 ring-1 ring-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                          order.paymentInfo?.status === "succeeded"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.paymentInfo?.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Gateway</span>
                      <span className="font-semibold text-gray-900">
                        Stripe / Card
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment ID</span>
                      <span className="max-w-[180px] truncate font-medium text-gray-900">
                        {order.paymentInfo?.id || "N/A"}
                      </span>
                    </div>

                    {order.paidAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Paid On</span>
                        <span className="font-medium text-gray-900">
                          {new Date(order.paidAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
