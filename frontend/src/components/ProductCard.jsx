import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCartAPI } from "../features/products/Cart/cartSlice.js";

const ProductCard = ({ product }) => {
  //Rating is set to product.ratings in DB by default
  const dispatch = useDispatch();
  const [rating, setRating] = useState(product.ratings || 0);

  const { cartItems, loading } = useSelector((state) => state.cart);
  console.log("Cart Items",cartItems);
  const isInCart = cartItems.some((item) => item.product?._id === product._id);
  console.log(`${product.name}`,isInCart);

  const handleAddToCart = () => {
  if (isInCart) return; // 🚫 prevent second click logic

  dispatch(addToCartAPI({ productId: product._id, quantity: 1 }))
    .unwrap()
    .then(() => {
      toast.success("Item added to cart");
    })
    .catch(() => {
      toast.error("Failed to add item");
    });
  };

  return (
    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <Link to={`/product/${product._id}`} className="group block">
        <div className="h-56 overflow-hidden">
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold line-clamp-1 text-gray-800 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 font-semibold text-sm line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center gap-2">
          {/*Ratings is Component which is reusable*/}
          <Ratings value={rating} onRatingChange={(r) => setRating(r)} />
          <span className="font-serif text-sm text-gray-500">
            ({product.numOfReviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg text-blue-600 font-bold">
            ₹{product.price}
          </span>
          {isInCart ? (
            <Link
              to="/cart"
              className="bg-green-600 text-white px-4 py-1.5 text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
            >
              Go to Cart
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className={`bg-blue-600 text-white px-4 py-1.5 text-sm font-semibold rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
