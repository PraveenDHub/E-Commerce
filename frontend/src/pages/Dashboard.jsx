import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  Box,
  XCircle,
  Star,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../features/products/admin/adminSlice.js";
import { useEffect } from "react";
import Loader from "../components/Loader.jsx";
import CountUp from "react-countup";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const stats = [
    {
      title: "Total Revenue",
      value: dashboard?.totalRevenue || 0,
      prefix: "₹",
      icon: IndianRupee,

      bg: "bg-gradient-to-br from-yellow-100 to-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Total Orders",
      value: dashboard?.totalOrders || 0,
      icon: ShoppingCart,
      bg: "bg-gradient-to-br from-purple-100 to-violet-100",
      color: "text-violet-600",
    },
    {
      title: "Products",
      value: dashboard?.totalProducts || 0,
      icon: Package,
      bg: "bg-gradient-to-br from-blue-100 to-cyan-100",
      color: "text-cyan-600",
    },
    {
      title: "Active Users",
      value: dashboard?.totalUsers || 0,
      icon: Users,
      bg: "bg-gradient-to-br from-green-100 to-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "In Stock",
      value: dashboard?.inStock || 0,
      icon: Box,
      bg: "bg-gradient-to-br from-indigo-100 to-blue-100",
      color: "text-indigo-600",
    },
    {
      title: "Out of Stock",
      value: dashboard?.outOfStock || 0,
      icon: XCircle,
      bg: "bg-gradient-to-br from-red-100 to-rose-100",
      color: "text-rose-600",
    },
    {
      title: "Total Reviews",
      value: dashboard?.totalReviews || 0,
      icon: Star,
      bg: "bg-gradient-to-br from-orange-100 to-amber-100",
      color: "text-orange-600",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 mt-1 text-base">
              Real-time insights into your store's performance
            </p>
          </div>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 border border-gray-100 
                         shadow-sm hover:shadow-xl hover:-translate-y-1 
                         transition-all duration-300 ease-out"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 tracking-wide">
                    {item.title}
                  </p>
                  <h2 className="text-3xl font-semibold text-gray-900 mt-3 tracking-tighter">
                    <CountUp
                      end={item.value}
                      duration={1.5}
                      separator=","
                      prefix={item.prefix}
                    />
                  </h2>
                </div>

                <div
                  className={`p-4 rounded-2xl ${item.bg} flex items-center justify-center 
                             transition-transform group-hover:scale-110 duration-300`}
                >
                  <Icon className={`w-7 h-7 ${item.color}`} strokeWidth={2.25} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight / Motivational Box */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 
                      border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row 
                      items-center gap-8 shadow-sm">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow">
            <span className="text-3xl">🚀</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            Your store is performing strongly!
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Keep an eye on these metrics to continue optimizing inventory, 
            marketing, and customer experience. Great work so far.
          </p>
        </div>

        {/* <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-4 md:mt-0 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 
                     text-gray-700 rounded-2xl font-medium text-sm transition-colors flex items-center gap-2"
        >
          View Detailed Reports
          <span aria-hidden="true">→</span>
        </button> */}
      </div>
    </div>
  );
};

export default Dashboard;