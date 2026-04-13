import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Register from "./User/Register";
import PageNotFound from "./pages/PageNotFound";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Login from "./User/Login";
import { useDispatch,useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadUser } from "./features/products/User/userSlice.js";
import Profile from "./User/Profile.jsx";
import UpdateProfile from "./User/UpdateProfile.jsx";
import CartPage from "./pages/CartPage.jsx";
import Shipping from "./components/Shipping.jsx";
import ConfirmOrder from "./pages/ConfirmOrder.jsx";
import Success from "./pages/Success.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Payment from "./pages/Payment.jsx";
import axios from "axios";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetails from "./pages/Orderdetails.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  const dispatch = useDispatch();
  const [stripeApiKey, setStripeApiKey] = useState("");

  // Load user on app start (only once)
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch Stripe API Key
  useEffect(() => {
    const getStripeApiKey = async () => {
      try {
        const { data } = await axios.get("/api/v1/payment/stripeapikey");
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.error("Failed to load Stripe key", error);
      }
    };
    getStripeApiKey();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          {" "}
          {/* Any logged-in user */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          {/* Payment Route with Stripe */}
          {stripeApiKey && (
            <Route
              path="/payment"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  {" "}
                  <Payment />{" "}
                </Elements>
              }
            />
          )}
          <Route path="/success" element={<Success />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/orders" element={<AdminOrders />} />
          {/* Add more admin routes here */}
        </Route>

        {/* Other Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
