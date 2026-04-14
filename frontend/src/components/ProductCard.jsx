import { Link, useNavigate } from "react-router-dom";
import Ratings from "./Ratings";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCartAPI } from "../features/products/Cart/cartSlice.js";
import { Heart, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rating, setRating] = useState(product.ratings || 0);
  const { user } = useSelector((state) => state.user);
  const { cartItems, loading } = useSelector((state) => state.cart);
  
  const [adding, setAdding] = useState(false);
  //const [isWishlisted, setIsWishlisted] = useState(false); // Future wishlist functionality

  const isInCart = cartItems.some(
    (item) => (typeof item.product === "string" ? item.product : item.product?._id) === product._id
  );

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login?redirect=/products");
      return;
    }

    if (isInCart || adding) return;

    setAdding(true);
    dispatch(addToCartAPI({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success("Added to cart successfully");
      })
      .catch(() => {
        toast.error("Failed to add item");
      })
      .finally(() => {
        setAdding(false);
      });
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative">
        <Link to={`/product/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button */}
        {/* <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-all hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button> */}

        {/* Discount Badge (if applicable) */}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5">
        <Link to={`/product/${product._id}`} className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-2 mt-4">
          <Ratings value={rating} onRatingChange={(r) => setRating(r)} />
          <span className="text-xs text-gray-500 font-medium">
            ({product.numOfReviews})
          </span>
        </div>

        {/* Price & Button */}
        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
            )}
          </div>

          {isInCart ? (
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Go to Cart
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={loading || adding}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200
                ${adding || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30"
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;