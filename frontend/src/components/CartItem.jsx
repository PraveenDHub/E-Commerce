import { Minus, Plus, Trash2 } from "lucide-react"
import { useDispatch } from "react-redux";
import { removeCartAPI, updateCartAPI } from "../features/products/Cart/cartSlice.js";
import toast from "react-hot-toast";


const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  // 🔥 Normalize productId (IMPORTANT)
  const productId = item.product?._id || item.product;

  // ➕ Increase
  const handleIncrease = () => {
    dispatch(
      updateCartAPI({
        productId,
        quantity: item.quantity + 1,
      })
    );
  };

  // ➖ Decrease
  const handleDecrease = () => {
    if (item.quantity === 1) {
      toast.error("Minimum quantity is 1");
      return;
    }

    dispatch(
      updateCartAPI({
        productId,
        quantity: item.quantity - 1,
      })
    );
  };

  // 🗑 Remove
  const handleRemove = () => {
    dispatch(removeCartAPI(productId));
    toast.success("Item removed");
  };

  return (
    <div className="flex items-center gap-4 bg-slate-100 py-4 pl-4 pr-1.5 rounded-xl mb-4 border border-slate-100">
      
      {/* ✅ Safe image fallback */}
      <img
        src={item.image || item.product?.images?.[0]?.url}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg shadow-sm"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-slate-800">{item.name}</h3>
        <p className="text-sm font-medium text-indigo-600">
          ₹{(item.price * item.quantity).toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col gap-2 items-end">

        {/* 🗑 REMOVE */}
        <button
          onClick={handleRemove}
          className="text-slate-400 p-2 hover:text-red-500 transition"
        >
          <Trash2 size={16} />
        </button>

        {/* ➕➖ QUANTITY */}
        <div className="bg-amber-50 flex items-center border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          
          <button
            onClick={handleDecrease}
            className="w-6 h-6 hover:bg-slate-100 flex items-center justify-center"
          >
            <Minus size={16} />
          </button>

          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>

          <button
            onClick={handleIncrease}
            className="w-6 h-6 hover:bg-slate-100 flex items-center justify-center"
          >
            <Plus size={16} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default CartItem;