import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Menu, Search, ShoppingCart, User, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = false;
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()){
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }else{
      navigate("/products");
    }
  };

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
            to="/about-us"
          >
            About Us
          </Link>
          <Link
            className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
            to="/contact-us"
          >
            Contact Us
          </Link>
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
            <span className="absolute -top-2 -right-1 bg-blue-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-semibold">
              6
            </span>
          </Link>

          {/* Register Button */}
          {!isAuthenticated && (
            <Link
              to="/register"
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-2 py-1 rounded-sm hover:bg-blue-700 transition duration-200"
            >
              <User size={18} />
              Register
            </Link>
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
            to="/about-us"
          >
            About Us
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
