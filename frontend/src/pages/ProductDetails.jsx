import {
  Calendar,
  MessageSquare,
  Minus,
  PackageCheck,
  PackageX,
  Plus,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Ratings from "../components/Ratings";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSuccess,
  createReview,
  getProductDetails,
  removeError,
} from "../features/products/productSlice";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { calculateDiscount, formatDate } from "../utils/formatter";
import {
  addToCartAPI,
  updateCartAPI,
} from "../features/products/Cart/cartSlice.js";
import Loader from "../components/Loader.jsx";

const ProductDetails = () => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  
  // Image slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error, success, message } = useSelector(
    (state) => state.product
  );
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const cartItem = product
  ? cartItems.find(
      (i) =>
        i.product?.toString() === product._id ||
        i.product?._id === product._id
    )
  : null;

  // Image helpers
  const images = product?.images || [];
  const currentImage = images[currentImageIndex]?.url;

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

useEffect(() => {
  if (success && message) {
    toast.dismiss(); // 🔥 prevent duplicate stacking
    toast.success(message, { duration: 3000 });

    dispatch(clearSuccess());

    setUserRating(0);
    setComment("");
  }
}, [success, message, dispatch]);

useEffect(() => {
  if (id) {
    dispatch(getProductDetails(id));
    setCurrentImageIndex(0); // Reset slider when product changes
  }
}, [dispatch, id]);

useEffect(() => {
  if (error) {
    toast.dismiss();
    toast.error(error, { duration: 3000 });

    dispatch(removeError());
  }
}, [error, dispatch]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment) {
      toast.error("Please enter a comment");
      return;
    }
    dispatch(
      createReview({ productId: product._id, rating: userRating, comment })
    );
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      // navigate("/login?redirect=/products"); // uncomment if you have navigate
      return;
    }
    if (cartItem) return;
    dispatch(addToCartAPI({ productId: product._id, quantity: 1 }));
  };

  const handleIncrease = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!cartItem) {
      dispatch(addToCartAPI({ productId: product._id, quantity: 1 }));
      toast.success("Item added to cart");
    } else {
      dispatch(
        updateCartAPI({
          productId: product._id,
          quantity: cartItem.quantity + 1,
        })
      );
    }
  };

  const handleDecrease = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!cartItem) return;
    if (cartItem.quantity === 1) {
      toast.error("Minimum quantity is 1");
      return;
    }
    dispatch(
      updateCartAPI({
        productId: product._id,
        quantity: cartItem.quantity - 1,
      })
    );
  };

  if (loading) {
  return <Loader/>;
}

if (!product) {
  return <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-3">
                <span className="text-5xl">📦</span>
                <p className="text-lg font-medium">No products available</p>
                <p className="text-sm text-gray-400">
                  Try changing filters or add a product
                </p>
              </div>;
}

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title={`${product?.name} | E-Commerce`} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Main Product Section - Amazon Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl shadow-sm p-6 md:p-10">
          
          {/* ==================== LEFT: IMAGE SLIDER ==================== */}
          <div className="flex flex-col">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-6" onMouseEnter={() => setVisible(true)}
                    onMouseLeave={() => setVisible(false)}>
              {images.length > 0 ? (
                <img
                  src={currentImage || "/placeholder.png"}
                  alt={product?.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  {visible && <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 p-3 rounded-full shadow-md transition"
                  >
                    <ChevronLeft size={28} />
                  </button>}
                  {visible && <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 p-3 rounded-full shadow-md transition"
                  >
                    <ChevronRight size={28} />
                  </button>}
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all snap-start ${
                      index === currentImageIndex
                        ? "border-amber-500 scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ==================== RIGHT: PRODUCT DETAILS ==================== */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product?.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <Ratings value={product?.ratings} disabled={true} />
              <span className="text-sm text-gray-500">
                {product?.numOfReviews} verified reviews
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-amber-600">
                ₹{product?.price}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ₹{product?.mrp}
              </span>
              <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded">
                {calculateDiscount(product?.price, product?.mrp)}% off
              </span>
            </div>

            <p className="text-gray-600 text-[17px] leading-relaxed mb-8">
              {product?.description}
            </p>

            {/* Stock & Cart Section */}
            <div className="border-t border-b border-gray-200 py-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                {product?.stock > 0 ? (
                  <>
                    <PackageCheck className="text-green-600" size={24} />
                    <span className="font-medium text-green-700">
                      In Stock ({product?.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <PackageX className="text-red-600" size={24} />
                    <span className="font-medium text-red-700">Out of Stock</span>
                  </>
                )}
              </div>

              {product?.stock > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex border-2 border-gray-300 rounded-xl">
                    <button
                      onClick={handleDecrease}
                      className="p-4 hover:text-amber-500 transition"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-8 py-4 font-bold text-lg border-x border-gray-300">
                      {cartItem?.quantity || 0}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="p-4 hover:text-amber-500 transition"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {cartItem ? (
                    <Link
                      to="/cart"
                      className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold text-center hover:bg-green-700 transition"
                    >
                      Go to Cart
                    </Link>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition"
                    >
                      <ShoppingCart size={22} />
                      Add to Cart
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-200"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="text-amber-500" />
                Write a Review
              </h3>
              <Ratings
                value={userRating}
                disabled={false}
                onRatingChange={setUserRating}
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the product quality and delivery?"
                className="w-full mt-4 p-4 border border-slate-300 rounded-2xl focus:outline-none focus:border-amber-500 min-h-[100px]"
              />
              <button
                type="submit"
                className="mt-4 w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-slate-800 transition"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>

        {/* ==================== CUSTOMER REVIEWS SECTION ==================== */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            Customer Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product?.reviews?.map((review) => (
              console.log(review),
              <div
                key={review._id}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100">
                      <img
                        src={
                          review?.avatar?.url ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={review?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{review?.name}</h4>
                      <Ratings value={review?.rating} disabled={true} />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={16} />
                    {formatDate(review?.createdAt)}
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  "{review?.comment}"
                </p>
              </div>
            ))}
            {product?.reviews?.length === 0 && (
              <p className="text-gray-500 col-span-2 text-center py-10">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;