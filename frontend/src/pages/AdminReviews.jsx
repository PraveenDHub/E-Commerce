import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Trash2, Star, MessageSquare, X, Package } from "lucide-react";
import {
  getAllReviews,
  deleteReview,
} from "../features/products/review/reviewSlice.js";

const AdminReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reviews, loading } = useSelector((state) => state.review);
  const currentUser = useSelector((state) => state.user.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/");
      toast.error("Not authorized");
    } else {
      dispatch(getAllReviews());
    }
  }, [currentUser, dispatch]);

  // ─── Filtered list ────────────────────────────────────────────────
  const filteredReviews = (reviews || [])
    .filter((r) => {
      const term = searchTerm.toLowerCase();
      return (
        r.productName?.toLowerCase().includes(term) ||
        r.name?.toLowerCase().includes(term) ||
        r.comment?.toLowerCase().includes(term) ||
        r.productId?.toLowerCase().includes(term)
      );
    })
    .filter((r) =>
      ratingFilter === "all" ? true : r.rating === Number(ratingFilter),
    );

  const totalReviews = reviews?.length || 0;
  const avgRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;
  const fiveStarCount = reviews?.filter((r) => r.rating === 5).length || 0;

  // ─── Delete ───────────────────────────────────────────────────────
  const handleDelete = (review) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-red-600 text-sm">
            🗑️ Delete this review by{" "}
            <span className="font-bold">{review.name}</span>?
          </p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await dispatch(
                    deleteReview({
                      productId: review.productId,
                      reviewId: review._id,
                    }),
                  ).unwrap();
                  toast.success("Review deleted successfully");
                  dispatch(getAllReviews());
                } catch {
                  toast.error("Failed to delete review");
                }
              }}
              className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-5 py-2 bg-gray-200 rounded-xl text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 },
    );
  };

  // ─── Helpers ──────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
        }`}
      />
    ));

  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (rating === 3) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-600 border-red-200";
  };

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Reviews Moderation
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 uppercase tracking-wider font-medium">
                Managing feedback across {totalReviews} entr
                {totalReviews === 1 ? "y" : "ies"}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter reviews or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Stat Pills ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            {
              label: "Total Reviews",
              value: totalReviews,
              icon: "💬",
              color: "text-gray-900",
            },
            {
              label: "Avg Rating",
              value: `${avgRating} ★`,
              icon: "⭐",
              color: "text-amber-600",
            },
            {
              label: "5-Star Reviews",
              value: fiveStarCount,
              icon: "🏆",
              color: "text-emerald-600",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm"
            >
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}

          {/* Rating filter chips */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {["all", "5", "4", "3", "2", "1"].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition ${
                  ratingFilter === r
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}
              >
                {r === "all" ? "All" : `${r} ★`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    { label: "Product Hub", align: "left" },
                    { label: "Reviewer", align: "left" },
                    { label: "Rating", align: "center" },
                    { label: "Commentary", align: "left" },
                    { label: "Actions", align: "center" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-${h.align}`}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-20 text-center text-gray-400 text-sm"
                    >
                      Loading reviews...
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <MessageSquare className="w-10 h-10 opacity-30" />
                        <p className="font-medium text-gray-500">
                          No reviews found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr
                      key={review._id}
                      className="hover:bg-orange-50/30 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {review.productImage ? (
                            <img
                              src={review.productImage}
                              alt={review.productName}
                              className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm leading-tight">
                              {review.productName || "Unknown Product"}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              REF: {review.productId?.slice(-8)?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Reviewer */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <span>📅</span>
                          {formatDate(review.createdAt)}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${getRatingColor(review.rating)}`}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          {review.rating}
                        </div>
                        <div className="flex justify-center gap-0.5 mt-1.5">
                          {renderStars(review.rating)}
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {review.comment || (
                            <span className="text-gray-400 italic">
                              No comment
                            </span>
                          )}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(review)}
                          className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {filteredReviews.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                Showing {filteredReviews.length} of {totalReviews} reviews
              </div>
            )}
          </div>

          {/* ── Mobile Cards ── */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                Loading reviews...
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <MessageSquare className="w-10 h-10 opacity-30" />
                  <p className="font-medium text-gray-500">No reviews found</p>
                </div>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review._id} className="p-5">
                  {/* Product row */}
                  <div className="flex items-start gap-3">
                    {review.productImage ? (
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                            {review.productName || "Unknown Product"}
                          </p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">
                            REF: {review.productId?.slice(-8)?.toUpperCase()}
                          </p>
                        </div>
                        <div
                          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${getRatingColor(review.rating)}`}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          {review.rating}
                        </div>
                      </div>

                      <div className="flex gap-0.5 mt-1.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Review meta */}
                  <div className="mt-3 pl-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          📅 {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(review)}
                        className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed bg-gray-50 rounded-xl px-3 py-2">
                        "{review.comment}"
                      </p>
                    )}
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

export default AdminReviews;
