import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Download, Eye, Trash2, Calendar } from "lucide-react";
import CountUp from "react-countup";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/admin/orders");

      const formatted = data.orders.map((order) => ({
        _id: order._id,
        orderId: order._id.slice(-6).toUpperCase(),
        customerName: order.user?.name,
        customerEmail: order.user?.email,
        totalAmount: order.totalPrice,
        status: order.orderStatus,
        createdAt: order.createdAt,
        items: order.orderItems.length,
        paymentStatus:
          order.paymentInfo?.status === "succeeded" ? "Paid" : "Failed",
      }));

      setOrders(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/v1/admin/order/${id}`, { status });
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const confirmDelivered = (orderId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-orange-600">
            ⚠️ Mark this order as Delivered?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                updateStatus(orderId, "Delivered");
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 },
    );
  };

  const deleteOrder = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium text-red-600">🗑️ Delete this order?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/v1/admin/order/${id}`);
                toast.success("Order deleted");
                fetchOrders();
              } catch (err) {
                toast.error(err.response?.data?.message);
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      toast.error("Not authorized");
      return;
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      Processing: "bg-amber-100 text-amber-700 border border-amber-200",
      Packed: "bg-blue-100 text-blue-700 border border-blue-200",
      Shipped: "bg-purple-100 text-purple-700 border border-purple-200",
      Delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      Cancelled: "bg-red-100 text-red-700 border border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const filterByDate = (order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    if (dateFilter === "today") {
      return orderDate.toDateString() === now.toDateString();
    }
    if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return orderDate >= weekAgo;
    }
    if (dateFilter === "month") {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  };

  const filteredOrders = orders
    .filter(filterByDate) // 🔥 apply date filter
    .filter(
      (o) =>
        o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalAmount,
    0,
  );
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled",
  ).length;

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              Orders Management
            </h1>
            <p className="text-gray-500 mt-1">
              Real-time overview of all customer orders
            </p>
          </div>

          <button
            onClick={() => toast.success("Export coming soon 😄")}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-5 h-5" />
            Export to CSV
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <h2 className="text-4xl font-semibold text-gray-900 mt-2">
                  <CountUp end={totalOrders} duration={1.5} />
                </h2>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                📦
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <h2 className="text-4xl font-semibold text-emerald-600 mt-2">
                  ₹<CountUp end={totalRevenue} duration={1.5} separator="," />
                </h2>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                💰
              </div>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <h2 className="text-4xl font-semibold text-emerald-600 mt-2">
                  <CountUp end={deliveredOrders} duration={1.5} />
                </h2>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                ✅
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h2 className="text-4xl font-semibold text-amber-600 mt-2">
                  <CountUp end={pendingOrders} duration={1.5} />
                </h2>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                ⏳
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        {/* SEARCH & FILTERS - Premium Design */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 py-4 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-2xl outline-none text-base placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Date Filter */}
            <div className="flex flex-col w-full lg:w-auto">
              <label className="text-xs font-medium text-gray-500 mb-1.5 ml-1">
                Date Range
              </label>
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full lg:w-52 appearance-none bg-gray-50 border border-gray-200 px-5 py-4 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-all pr-10"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">This Month</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchTerm("");
                setDateFilter("all");
              }}
              className="w-full lg:w-auto px-8 py-4 bg-white border border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50 text-gray-700 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* TABLE */}
        {/* RESPONSIVE TABLE / CARD SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                    Order ID
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600">
                    Items
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-indigo-50/50 transition-colors group"
                  >
                    <td className="px-6 py-6 font-mono font-semibold text-gray-900">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">
                        {order.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right font-semibold text-lg">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                        {order.items}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus === "Delivered") {
                            confirmDelivered(order._id);
                            return;
                          }
                          updateStatus(order._id, newStatus);
                        }}
                        className={`px-5 py-2 text-sm font-medium rounded-2xl ${getStatusColor(order.status)}`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>

                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Shown only on mobile */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-mono font-semibold text-lg text-gray-900">
                      #{order.orderId}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-xl">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Customer</p>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {order.customerEmail}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-1">Items</p>
                    <span className="inline-block w-8 h-8 bg-gray-100 rounded-full text-center leading-8 font-medium">
                      {order.items}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      if (newStatus === "Delivered") {
                        confirmDelivered(order._id);
                        return;
                      }
                      updateStatus(order._id, newStatus);
                    }}
                    className={`px-5 py-2.5 text-sm font-medium rounded-2xl ${getStatusColor(order.status)}`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      <Eye className="w-5 h-5" /> View
                    </button>
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Orders Message */}
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                📭
              </div>
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default AdminOrders;
