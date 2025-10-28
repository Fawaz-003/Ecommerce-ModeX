import React, { useState, useEffect } from "react";
import {
  User2,
  Heart,
  ShoppingBag,
  Truck,
  Package,
  CreditCard,
  Star,
  Gift,
  Bell,
  ChevronRight,
  User,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import Logout from "../../../Components/Logout";
import PersonalInfo from "./UserMenuItems/PersonalInfo";
import Wishlist from "./UserMenuItems/UserWishlist";
import Orders from "./UserMenuItems/UserOrders";
import Addresses from "./UserMenuItems/UserAddresses";
import Returns from "./UserMenuItems/UserReturns";
import Payments from "./UserMenuItems/UserPayments";
import Reviews from "./UserMenuItems/UserReviews";
import Coupons from "./UserMenuItems/UserCoupons";
import Notifications from "./UserMenuItems/UserNotification";

const UserProfile = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = localStorage.getItem("user");
      if (response) {
        const userData = JSON.parse(response);
        setUser(userData);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sidebar items: label + route slug + icon
  const menuItems = [
    { icon: User2, label: "Personal Information", slug: "personal-information" },
    { icon: Heart, label: "Wishlist", slug: "wishlist" },
    { icon: ShoppingBag, label: "My Orders", slug: "my-orders" },
    { icon: Truck, label: "Addresses", slug: "addresses" },
    { icon: Package, label: "Returns & Refunds", slug: "returns-refunds" },
    { icon: CreditCard, label: "Payment Methods", slug: "payment-methods" },
    { icon: Star, label: "My Reviews", slug: "my-reviews" },
    { icon: Gift, label: "Gift Cards & Coupons", slug: "coupons" },
    { icon: Bell, label: "Notifications", slug: "notifications" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Sticky Sidebar */}
          <div className="md:col-span-1 lg:sticky lg:top-24 self-start">
            <div className="flex flex-col h-full">
              <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {imagePreview || user.avatar ? (
                        <img
                          src={imagePreview || user.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-600">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Hello,</p>
                    <p className="font-semibold text-gray-900">
                      {user.name || "Guest User"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-grow">
                <div className="max-h-[calc(100vh-250px)] overflow-y-auto divide-y divide-gray-100">
                  {menuItems.map((item, index) => (
                    <NavLink
                      key={index}
                      to={`/profile/${item.slug}`}
                      className={({ isActive }) =>
                        `p-3 flex items-center justify-between group transition-all duration-100 ${
                          isActive ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600" : "hover:bg-gray-50"
                        }`
                      }
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Logout />
              </div>
            </div>
          </div>

          {/* Main content area (nested routes will render here) */}
          <div className="md:col-span-2 lg:col-span-3 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
