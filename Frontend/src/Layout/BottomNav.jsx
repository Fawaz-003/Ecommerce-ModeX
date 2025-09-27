import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Grid, LogIn, User } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: <Home size={20} /> },
  { name: "Collections", path: "/collections", icon: <Grid size={20} /> },
  { name: "Profile", path: "/Login", icon: <User size={20} /> },
];

const BottomNav = ({ hidden }) => {
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t border-gray-200 sm:hidden z-40 bottom-navbar">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-sm transition-transform duration-200 transform nav-item
              ${isActive ? "text-red-700" : "text-gray-500 hover:text-red-600"}`
            }
          >
            {({ isActive }) => (
              <div className="relative flex flex-col items-center">
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>

                {isActive && (
                  <span className="absolute -top-2 w-full h-1 bg-red-700 rounded-b "></span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
