import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Plus, Trash2, EditIcon } from "lucide-react";
import {
  getAdminProducts,
  deleteProduct,
} from "../features/products/productSlice.js";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      toast.error("Not authorized");
    } else {
      dispatch(getAdminProducts());
    }
  }, [user, dispatch]);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-red-600">
          🗑️ Delete this product permanently?
        </p>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await dispatch(deleteProduct(id)).unwrap();
                toast.success("Product deleted");

                // 🔥 Refresh list after delete
                dispatch(getAdminProducts());
              } catch {
                toast.error("Delete failed");
              }
            }}
            className="px-5 py-2 bg-red-600 text-white rounded-xl font-medium"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-5 py-2 bg-gray-200 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const filteredProducts = products
    .filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((p) => categoryFilter === "All" || p.category === categoryFilter)
    .filter((p) => {
      if (stockFilter === "low") return p.stock <= 5;
      if (stockFilter === "out") return p.stock === 0;
      return true;
    });

  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.price * (p.stock || 0),
    0,
  );
  const lowStockItems = products.filter((p) => p.stock <= 5).length;
  const allReviews = products.flatMap((p) => p.reviews || []);

  const avgRating = allReviews.length
    ? (
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      ).toFixed(1)
    : 0;

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              Products Management
            </h1>
            <p className="text-gray-500 mt-1">Manage your complete catalog</p>
          </div>
          <button
            onClick={() => navigate("/admin/product/create")}
            className="flex items-center gap-3 px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition"
          >
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Products", value: totalProducts, icon: "📦" },
            {
              label: "Stock Value",
              value: `₹${totalStockValue.toLocaleString()}`,
              icon: "💰",
              color: "text-emerald-600",
            },
            {
              label: "Low Stock",
              value: lowStockItems,
              icon: "⚠️",
              color: "text-amber-600",
            },
            {
              label: "Avg Rating",
              value: `${avgRating} ★`,
              icon: "⭐",
              color: "text-purple-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <h2
                    className={`text-4xl font-semibold mt-2 ${stat.color || "text-gray-900"}`}
                  >
                    {stat.value}
                  </h2>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-400 transition"
              />
            </div>

            <div className="flex flex-col w-full sm:w-56">
              <label className="text-xs font-medium text-gray-500 mb-1.5 ml-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-2xl focus:outline-none focus:border-orange-400 transition"
              >
                <option value="All">All Categories</option>
                {[...new Set(products.map((p) => p.category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full sm:w-56">
              <label className="text-xs font-medium text-gray-500 mb-1.5 ml-1">
                Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-2xl focus:outline-none focus:border-orange-400 transition"
              >
                <option value="all">All Stock</option>
                <option value="low">Low Stock (≤5)</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
                setStockFilter("all");
              }}
              className="w-full sm:w-auto px-8 py-4 border border-gray-300 hover:bg-red-50 hover:text-red-600 rounded-2xl font-medium whitespace-nowrap transition mt-6 sm:mt-0"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                    Image
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600">
                    Stock
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600">
                    Rating
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-16 text-gray-400 text-sm"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-16">
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <span className="text-5xl">📦</span>
                        <p className="text-lg font-medium">
                          {searchTerm
                            ? `No products found for "${searchTerm}"`
                            : categoryFilter !== "All" || stockFilter !== "all"
                              ? "No products match selected filters"
                              : "No products available"}
                        </p>
                        <p className="text-sm text-gray-400">
                          Try adjusting filters or add a new product
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-2xl border border-gray-100"
                        />
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-semibold text-gray-900">
                        ₹{product.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium ${
                            product.stock === 0
                              ? "bg-red-100 text-red-700"
                              : product.stock <= 5
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center text-gray-700">
                        {product.ratings?.toFixed(1) || "—"} ★
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/product/edit/${product._id}`)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                            title="Edit product"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                            title="Delete product"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-3">
                <span className="text-5xl">📦</span>
                <p className="text-lg font-medium">No products available</p>
                <p className="text-sm text-gray-400">
                  Try changing filters or add a product
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-2xl border border-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="font-bold text-xl text-gray-900">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            product.stock === 0
                              ? "bg-red-100 text-red-700"
                              : product.stock <= 5
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {product.stock} left
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <div>
                      <span className="text-xs text-gray-500">Category</span>
                      <p className="font-medium text-gray-700">
                        {product.category}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/product/edit/${product._id}`)
                        }
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;



<div className="lg:col-span-4">
            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-8"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                Payment Details
              </h2>

              <div className="space-y-5 text-[16px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

                <div className="flex justify-between">
                  <span className="text-gray-600">Gateway</span>
                  <span className="font-medium text-gray-900">
                    Stripe / Card
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-medium text-gray-900">
                    {order.paymentInfo?.id || "N/A"}
                  </span>
                </div>

                {order.paidAt && (
                  <div className="flex justify-between">
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
            </motion.div>
          </div>
