import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Menu,
  X,
  Settings,
  BookCopy,
} from "lucide-react";
import Logout from "../../../Components/Logout";

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "dashboard",
      icon: LayoutDashboard,
      
    },
    {
      name: "Products",
      path: "products",
      icon: Package,
    },
    {
      name: "Users",
      path: "users",
      icon: Users,
      
    },
    {
      name: "Orders",
      path: "orders",
      icon: ShoppingBag,
    },
    {
      name: "Settings",
      path: "settings",
      icon: Settings,
    },
    {
      name: "Categories",
      path: "categories",
      icon: BookCopy,
    }
  ];

  const isActiveLink = (path) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {sidebarOpen ? (
          <X size={20} className="text-gray-600" />
        ) : (
          <Menu size={20} className="text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="p-6 pt-23 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-[rgba(237,66,97,0.78)]">
                Welcome {user?.name}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-gray-100 to-gray-100 text-slate-900 shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    size={20}
                    className={`${
                      isActive ? "text-slate-900" : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isActive 
                        ? "bg-white bg-opacity-20 text-white" 
                        : "bg-slate-700 text-slate-300"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center mt-5">
            <Logout />
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;