import { Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, Search, ShoppingCart, User, X, ShieldCheck, ArrowRight } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { logout, removeSuccess } from "../features/products/User/userSlice.js";
import toast from "react-hot-toast";
import { clearCart, getCart } from "../features/products/Cart/cartSlice.js";

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isAuthenticated,user,success,message} = useSelector((state)=>state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cartItems} = useSelector((state)=>state.cart);
  const cartItemsCount = cartItems.reduce((acc,item)=> acc + item.quantity,0);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()){
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }else{
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
};

  useEffect(() => {
    if(success){
      toast.success(message);
      dispatch(removeSuccess());
    }
  }, [success,message,dispatch]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="flex items-center justify-between h-16 px-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex gap-2 text-xl font-bold text-blue-600 items-center"
        >
          <ShoppingBag />
          <span>Shopping | Hub</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
            to="/products"
          >
            Products
          </Link>

          <Link
            className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
            to="/contact-us"
          >
            Contact Me
          </Link>
          {isAuthenticated && user?.role === "admin" && (
  <button
    onClick={() => navigate('/admin/orders')}
    className="flex items-center gap-3 px-7 py-2 bg-zinc-900 hover:bg-black border border-zinc-700 hover:border-violet-500 rounded-2xl text-white font-medium transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20 group"
  >
    <ShieldCheck className="w-5 h-4 text-violet-400" />
    <span>Admin Dashboard</span>
    <ArrowRight className="w-5 h-4 group-hover:translate-x-1.5 transition-transform" />
  </button>
)}
          
        </div>

        {/* Right Side Search Bar only on tablet and Desktop */}
        <div className="flex items-center gap-8">
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center hover:border-blue-600 transition duration-200 rounded-sm border border-slate-300 overflow-hidden px-2"
          >
            <input
              type="text"
              placeholder="Search Products"
              className="focus:outline-none py-2 px-1 text-gray-400 w-40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="text-gray-400 hover:text-blue-600 transition duration-200"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600 transition duration-200"
          >
            <ShoppingCart size={24} />
            <span className={`absolute -top-2 -right-1 bg-blue-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-semibold`}>
              {cartItemsCount}
            </span>
          </Link>

          {/* Register Button */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
              to="/login"
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-sm hover:bg-gray-300 transition duration-200"
            >
              <User size={18} />
              Login
            </Link>
              <Link
              to="/register"
              className="flex items-center gap-2 bg-blue-600 text-white px-2 py-1 rounded-sm hover:bg-blue-700 transition duration-200"
            >
              <User size={18} />
              Register
            </Link>
            </div>
          ): (
            <div className="relative">
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center w-11 h-11 cursor-pointer">
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover rounded-full ring-1 ring-gray-500" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute top-12 right-4 bg-white shadow-lg rounded-md p-2">
                  <div className="flex flex-col">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <div>
                          <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-gray-200">
                        <button
                        onClick={()=>{
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full cursor-pointer px-4 py-2 text-red-600 hover:bg-red-100"
                      >
                        Logout
                      </button>
                      </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition duration-200"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden overflow-hidden ${isMenuOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-5"} transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col gap-4 p-4">
          <Link
            onClick={() => {
              setIsMenuOpen(false);
            }}
            className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
            to="/"
          >
            Home
          </Link>
          <Link
            onClick={() => {
              setIsMenuOpen(false);
            }}
            className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
            to="/products"
          >
            Products
          </Link>
          <Link
            onClick={() => {
              setIsMenuOpen(false);
            }}
            className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
            to="/contact-us"
          >
            Contact Us
          </Link>
          {isAuthenticated && user?.role === "admin" && (
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-3 px-7 py-2 bg-zinc-900 hover:bg-black border border-zinc-700 hover:border-violet-500 rounded-2xl text-white font-medium transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20 group"
          >
            <ShieldCheck className="w-5 h-4 text-violet-400" />
            <span>Admin Dashboard</span>
            <ArrowRight className="w-5 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
