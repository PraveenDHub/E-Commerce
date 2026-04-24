import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "All Orders", icon: ShoppingCart, path: "/admin/orders" },
    { name: "All Products", icon: Package, path: "/admin/products" },
    { name: "Add Product", icon: PlusCircle, path: "/admin/product/create" },
    { name: "All Users", icon: Users, path: "/admin/users" },
    // ⭐ NEW FEATURE (Review delete)
    { name: "All Reviews", icon: Star, path: "/admin/reviews" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Mobile Toggle Button */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="font-semibold text-gray-700">Admin Panel</h2>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
  className={`
    fixed md:sticky top-0 md:top-16 left-0 z-50
    h-screen md:h-[calc(100vh-64px)]
    w-64 bg-white border-r border-gray-200 px-3 py-4
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
  `}
>
          {/* Close Button (Mobile) */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-blue-600">Admin</h2>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X />
            </button>
          </div>

          <p className="hidden md:block text-xs text-gray-400 uppercase mb-4 px-2 tracking-wide">
  Admin Panel
</p>

          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false); // close on mobile
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${
                      isActive(item.path)
  ? "bg-blue-50 text-blue-600"
  : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay (Mobile) */}
        {isSidebarOpen && (
  <div
    onClick={() => setIsSidebarOpen(false)}
    className="fixed inset-0 bg-black/30 z-40 md:hidden"
  />
)}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 w-full">
  <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
