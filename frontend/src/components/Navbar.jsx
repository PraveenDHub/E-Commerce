import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, Search, ShoppingCart, User, X, ShieldCheck, ArrowRight, LogOut, UserCircle, Package } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout, removeSuccess } from "../features/products/User/userSlice.js";
import toast from "react-hot-toast";
import { clearCart, getCart } from "../features/products/Cart/cartSlice.js";

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, success, message } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
    setSearchQuery("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(removeSuccess());
    }
  }, [success, message, dispatch]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <ShoppingBag className="w-8 h-8" />
            <span>ShoppingHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className={`relative py-5 transition-all hover:text-blue-600 ${isActive("/") ? "text-blue-600" : "text-gray-700"}`}>
              Home
              {isActive("/") && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
            </Link>
            <Link to="/products" className={`relative py-5 transition-all hover:text-blue-600 ${isActive("/products") ? "text-blue-600" : "text-gray-700"}`}>
              Products
              {isActive("/products") && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
            </Link>
            <Link to="/contact-us" className={`relative py-5 transition-all hover:text-blue-600 ${isActive("/contact-us") ? "text-blue-600" : "text-gray-700"}`}>
              Contact
              {isActive("/contact-us") && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
            </Link>

            {isAuthenticated && user?.role === "admin" && (
              <button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center gap-3 px-6 py-2.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-2xl border border-zinc-700 hover:border-violet-500 transition-all hover:shadow-lg hover:shadow-violet-500/30"
              >
                <ShieldCheck className="w-5 h-5 text-violet-400" />
                Admin Dashboard
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center bg-gray-50 border border-gray-200 focus-within:border-blue-500 rounded-3xl px-4 py-2 w-72 transition-all"
            >
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm flex-1 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Cart */}
            <Link to="/cart" className="relative p-3 hover:bg-gray-100 rounded-2xl transition-all group">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-9 h-9 rounded-2xl overflow-hidden ring-2 ring-gray-200 hover:ring-blue-400 transition-all cursor-pointer"
                >
                  <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute top-14 right-0 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden">
                    {/* User Info */}
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar.url}
                          alt={user.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-4 px-6 py-3.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <UserCircle className="w-5 h-5" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-4 px-6 py-3.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Package className="w-5 h-5" />
                        <span>My Orders</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 mx-3 my-1" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 w-full px-6 py-3.5 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-2xl transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-2xl transition-all">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Same as before (kept clean) */}
      <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="px-6 py-6 bg-white border-t space-y-6 text-lg font-medium">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className={`block py-2 ${isActive("/") ? "text-blue-600" : "text-gray-700"}`}>Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)} className={`block py-2 ${isActive("/products") ? "text-blue-600" : "text-gray-700"}`}>Products</Link>
          <Link to="/contact-us" onClick={() => setIsMenuOpen(false)} className={`block py-2 ${isActive("/contact-us") ? "text-blue-600" : "text-gray-700"}`}>Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;