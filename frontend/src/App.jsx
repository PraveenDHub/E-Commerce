import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Register from "./User/Register";
import PageNotFound from "./pages/PageNotFound";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Login from "./User/Login";
import { useDispatch, useSelector } from "react-redux";
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
import API from "./api/api";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ForgetPassword from "./User/ForgetPassword.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ResetPassword from "./User/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateProduct from "./pages/CreateProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminReviews from "./pages/AdminReviews.jsx";

const App = () => {
  const dispatch = useDispatch();
  const [stripeApiKey, setStripeApiKey] = useState("");

  // Load user on app start (only once)
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  // Fetch Stripe API Key
  useEffect(() => {
    const getStripeApiKey = async () => {
      try {
        const { data } = await API.get("/api/v1/payment/stripeapikey");
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
        <Route path="/password/forget" element={<ForgetPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />

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

        {/* Admin Routes with Layout */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product/create" element={<CreateProduct />} />
            <Route path="/admin/product/edit/:id" element={<EditProduct />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            {/* Add more admin pages here later */}
          </Route>
        </Route>

        {/* Other Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
