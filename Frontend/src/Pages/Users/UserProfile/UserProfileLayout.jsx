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
  const [activeMenu, setActiveMenu] = useState("Personal Information");
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

  const menuItems = [
    { icon: User2, label: "Personal Information" },
    { icon: Heart, label: "Wishlist" },
    { icon: ShoppingBag, label: "My Orders" },
    { icon: Truck, label: "Addresses" },
    { icon: Package, label: "Returns & Refunds" },
    { icon: CreditCard, label: "Payment Methods" },
    { icon: Star, label: "My Reviews" },
    { icon: Gift, label: "Gift Cards & Coupons" },
    { icon: Bell, label: "Notifications" },
  ];

  const renderActiveComponent = () => {
    switch (activeMenu) {
      case "Personal Information":
        return <PersonalInfo />;
      case "Wishlist":
        return <Wishlist />;
      case "My Orders":
        return <Orders />;
      case "Addresses":
        return <Addresses />;
      case "Returns & Refunds":
        return <Returns />;
      case "Payment Methods":
        return <Payments />;
      case "My Reviews":
        return <Reviews />;
      case "Gift Cards & Coupons":
        return <Coupons />;
      case "Notifications":
        return <Notifications />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
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
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // fallback image
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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveMenu(item.label)}
                    className={`p-3 cursor-pointer flex items-center justify-between group transition-all duration-100 ${
                      activeMenu === item.label
                        ? "bg-blue-50 border-l-4 border-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`w-5 h-5 mr-3 ${
                          activeMenu === item.label
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          activeMenu === item.label
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 ${
                        activeMenu === item.label
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="my-10 px-10">
              <Logout />
            </div>
          </div>
          <div className="lg:col-span-3">{renderActiveComponent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
