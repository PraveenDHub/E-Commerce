import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, CreditCard } from "lucide-react";
import CheckoutSteps from "../components/CheckoutSteps.jsx";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  // 💰 Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty! Please add items.");
      navigate("/products");
    }
  }, [cartItems, navigate]);

  const shippingCharges = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingCharges + tax;

  const handlePayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* 🔄 Steps */}
      <CheckoutSteps shipping confirmOrder />

      <div className="grid md:grid-cols-3 gap-6 mt-6">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">

          {/* 📍 Shipping Info */}
          <div className="bg-slate-100 p-5 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <MapPin className="text-indigo-600" size={20}/>
              Shipping Info
            </h2>

            <div className="text-sm text-slate-600 space-y-1">
              <p><span className="font-medium text-slate-700">Address:</span> {shippingInfo.address}</p>
              <p>{shippingInfo.city}, {shippingInfo.state}</p>
              <p>{shippingInfo.country} - {shippingInfo.pinCode}</p>
              <p className="flex items-center gap-2 mt-2">
                <Phone size={14}/> {shippingInfo.phone}
              </p>
            </div>
          </div>

          {/* 🛒 Cart Items */}
          <div className="bg-slate-100 p-5 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Your Cart Items
            </h2>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white p-3 rounded-lg mb-3 border border-slate-200"
              >
                <img
                  src={item.image || "/fallback.png"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {item.quantity} × ₹{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="text-indigo-600 font-semibold text-sm">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-slate-100 p-5 rounded-xl border border-slate-200 shadow-sm h-fit">

          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-6">
            <CreditCard className="text-indigo-600" size={20}/>
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-slate-600">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shippingCharges === 0 ? "Free" : `₹ ${shippingCharges}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹ {tax.toLocaleString()}</span>
            </div>

            <div className="border-b border-slate-200 my-3"></div>

            <div className="flex justify-between text-lg font-semibold text-slate-800">
              <span>Total</span>
              <span className="text-indigo-600">
                ₹ {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
          >
            Proceed to Payment
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmOrder;