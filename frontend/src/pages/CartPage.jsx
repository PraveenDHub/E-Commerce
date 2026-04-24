import { useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCart } from "../features/products/Cart/cartSlice.js";

const CartPage = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const cartItemsCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);
  return (
    <>
      <div className="max-w-4xl mx-auto my-10">
        {cartItems.length > 0 ? (
          <>
            <div className="mb-6 p-6">
              <h2 className=" text-2xl font-bold tracking-tight text-slate-800 mb-4">
                Your Cart
              </h2>
            </div>

            <div className="space-y-8 px-8">
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Cart items
                </h3>
                <div className="pr-2 custom-scrollbar max-h-[400px] overflow-y-auto space-y-1">
                  {cartItems
                    .filter((item) => item.product !== null)
                    .map((item) => (
                      <CartItem key={item.product._id} item={item} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <CartSummary
                  total={totalAmount}
                  cartItemsCount={cartItemsCount}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white flex min-h-[60vh] flex-col items-center justify-center rounded-2xl p-8 text-center shadow-sm border border-slate-100 space-y-8">
            <div className="rounded-full bg-slate-300 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="text-slate-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-700">
              You Cart is empty
            </h3>
            <p className="text-sm text-slate-500">
              Looks like you haven't added anything to your cart yet
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
