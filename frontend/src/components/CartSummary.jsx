import { ArrowRight, ShoppingBag } from "lucide-react";
import { clearCartAPI } from "../features/products/Cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CartSummary = ({ total, cartItemsCount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const handleCheckout = () => {
    if (!isAuthenticated && !user) {
      navigate("/login?redirect=shipping");
    } else {
      navigate("/shipping");
    }
  };

  const handleClearCart = () => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">
        Are you sure you want to clear the cart?
      </p>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 text-xs bg-gray-200 rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            dispatch(clearCartAPI())
              .unwrap()
              .then(() => toast.success("Cart cleared"))
              .catch(() => toast.error("Failed to clear cart"));

            toast.dismiss(t.id);
          }}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded-md"
        >
          Yes, Clear
        </button>
      </div>
    </div>
  ));
};

  return (
    <div className=" flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800">
          <ShoppingBag className="text-indigo-600" />
          Your Cart
        </h2>
        <span className="text-indigo-600 px-2 font-semibold bg-indigo-100 rounded-2xl">
          {cartItemsCount} items
        </span>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">SubTotal</span>
          <span className="text-sm text-slate-500">
            ₹ {total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Tax(18%)</span>
          <span className="text-sm text-slate-500">
            ₹ {(total * 0.18).toLocaleString()}
          </span>
        </div>
        <div className="border-b border-slate-200 my-4"></div>
      </div>

      <div>
        <h3 className="flex justify-between text-lg font-semibold">
          Total{" "}
          <span className="text-indigo-600">
            ₹ {(total + total * 0.18).toLocaleString()}
          </span>
        </h3>
      </div>

      <button
        onClick={() => {
          handleCheckout();
        }}
        className="disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer group w-full bg-indigo-600 text-white font-medium py-2 rounded-lg mt-8 shadow-sm flex items-center justify-center hover:bg-indigo-700 transition-colors"
      >
        <span className="group-hover:font-bold">Checkout</span>
        <ArrowRight className="group-hover:translate-x-1 transition-all duration-160 ml-2" />
      </button>

      <button
        onClick={handleClearCart}
        className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 
             border border-red-700 rounded-xl shadow-md hover:shadow-lg 
             transition-all duration-200 flex items-center gap-2 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 group-active:rotate-12 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 7l-.595 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.595-1.858L5 7m5-4v6m4-6v6m1-10V9a1 1 0 00-1 1v1M12 4V3"
          />
        </svg>
        Clear Cart
      </button>
    </div>
  );
};

export default CartSummary;
