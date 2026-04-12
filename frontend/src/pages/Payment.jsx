import CheckoutSteps from "../components/CheckoutSteps.jsx";
import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { orderCompleted } from "../features/products/Cart/cartSlice.js";
import { CreditCard, Smartphone, Lock, ArrowRight, CheckCircle } from "lucide-react";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo")) || {};
  orderInfo.totalPrice = Math.round(Number(orderInfo.totalPrice) || 0);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
    }
    if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
      navigate("/shipping");
    }
  }, []);

  const upiLink = `upi://pay?pa=praveenpraveen82726@oksbi&pn=Praveen&am=${orderInfo.totalPrice}&cu=INR`;

  const paymentData = {
    amount: orderInfo.totalPrice,
    shipping: {
      name: user.name,
      phone: shippingInfo.phone,
      address: {
        line1: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        pinCode: shippingInfo.pinCode,
        country: shippingInfo.country,
      },
    },
  };

  const handlePayment = async () => {
    if (method === "upi") {
      toast('Complete the UPI payment and click "I Have Paid"', { icon: '👏' });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("/api/v1/payment/process", paymentData);
      const clientSecret = data.client_secret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              postal_code: shippingInfo.pinCode,
            },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const order = {
          shippingAddress: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pinCode,
            phoneNo: shippingInfo.phone,
          },
          orderItems: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images[0]?.url,
            product: item._id,
          })),
          paidAt: Date.now(),
          paymentInfo: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          },
          itemsPrice: orderInfo.subtotal,
          taxPrice: orderInfo.tax,
          shippingPrice: orderInfo.shippingCharges,
          totalPrice: orderInfo.totalPrice,
        };

        await axios.post("/api/v1/order/new", order);
        dispatch(orderCompleted());
        navigate("/success");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Payment failed. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <CheckoutSteps shipping confirmOrder payment />

        <div className="mt-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-2">
            
            {/* LEFT - Payment Methods */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900">Secure Payment</h2>
                  <p className="text-gray-500">Choose your preferred payment method</p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4 mb-10">
                <div
                  onClick={() => setMethod("card")}
                  className={`group flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                    method === "card"
                      ? "border-indigo-600 bg-indigo-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    method === "card" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Debit / Credit Card</p>
                    <p className="text-sm text-gray-500">Powered by Stripe • Secure</p>
                  </div>
                  {method === "card" && <CheckCircle className="ml-auto text-indigo-600 w-6 h-6" />}
                </div>

                <div
                  onClick={() => setMethod("upi")}
                  className={`group flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                    method === "upi"
                      ? "border-indigo-600 bg-indigo-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    method === "upi" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">UPI Payment</p>
                    <p className="text-sm text-gray-500">Google Pay • PhonePe • Paytm</p>
                  </div>
                  {method === "upi" && <CheckCircle className="ml-auto text-indigo-600 w-6 h-6" />}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-70"
              >
                {loading ? (
                  "Processing Payment..."
                ) : method === "card" ? (
                  `Pay ₹${orderInfo.totalPrice?.toLocaleString("en-IN") || 0} Now`
                ) : (
                  `I Have Completed UPI Payment - ₹${orderInfo.totalPrice?.toLocaleString("en-IN") || 0}`
                )}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secured by 256-bit SSL Encryption
              </p>
            </div>

            {/* RIGHT - Payment Details / QR */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-8 lg:p-12 text-white flex flex-col">
              {method === "card" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Enter Card Details</h3>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#ffffff",
                            "::placeholder": { color: "#a5b4fc" },
                          },
                        },
                      }}
                    />
                  </div>
                  <p className="text-sm mt-4 opacity-80">
                    Your card information is encrypted and secure
                  </p>
                </div>
              )}

              {method === "upi" && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h3 className="text-2xl font-semibold mb-2">Scan to Pay</h3>
                  <p className="text-indigo-100 mb-8">Use any UPI app to pay instantly</p>

                  <div className="bg-white p-4 rounded-3xl shadow-2xl">
                    <QRCodeCanvas 
                      value={upiLink} 
                      size={220} 
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="mt-8 space-y-2">
                    <p className="text-sm opacity-90">Supported Apps</p>
                    <div className="flex gap-4 text-2xl">
                      <span>🇮🇳 Google Pay</span>
                      <span>🇮🇳 PhonePe</span>
                      <span>🇮🇳 Paytm</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;