import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { getCart } from "../features/products/Cart/cartSlice";
import { useDispatch } from "react-redux";

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getCart());
      navigate("/");
    }, 3000);

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle 
                className="w-20 h-20 text-emerald-600 animate-[scale_0.6s_ease-in-out_forwards]" 
              />
            </div>
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight animate-fade-in">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 animate-fade-in delay-200">
            Your order has been placed successfully.
          </p>
          
          <p className="text-emerald-600 font-medium mt-2 animate-fade-in delay-400">
            🎉 Thank you for shopping with us!
          </p>
        </div>

        {/* Order Confirmation Box */}
        <div className="mt-10 bg-white border border-gray-100 shadow-sm rounded-3xl p-6 mx-auto max-w-xs">
          <div className="text-sm text-gray-500 mb-1">You will be redirected to homepage in</div>
          <div className="text-4xl font-semibold text-emerald-600 tabular-nums">
            {countdown} seconds
          </div>
        </div>

        {/* Manual Redirect Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-8 group flex items-center justify-center gap-2 mx-auto text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          Go to Homepage Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Subtle footer text */}
        <p className="text-xs text-gray-400 mt-12">
          A confirmation email has been sent to your registered email
        </p>
      </div>
    </div>
  );
};

export default Success;