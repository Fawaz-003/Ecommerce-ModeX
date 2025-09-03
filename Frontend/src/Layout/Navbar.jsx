import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [items, setItems] = useState(0);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold px-3 py-2 text-sm transition-colors duration-200"
      : "text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold block px-3 py-2 text-base transition-colors duration-200"
      : "text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium transition-colors duration-200";

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
              Mode<span className="text-red-500">X</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/collections" className={navLinkClass}>
                Collections
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - always visible */}
            <NavLink
              to="/cart"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-0 -right-0 bg-red-500 font-medium text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {items}
              </span>
            </NavLink>

            {/* Heart (Wishlist) icon visible on all screen sizes */}
            <NavLink
              to="/wishlist"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <Heart size={20} />
            </NavLink>

            {/* User icon visible only on desktop */}
            <div className="hidden md:flex items-center">
              <NavLink
                to="/login"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <User size={20} />
              </NavLink>
            </div>

            {/* Mobile menu button visible only on mobile */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu with animation */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden ${
          isMenuOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMenu}
        ></div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="px-4 py-4">
            <button
              onClick={toggleMenu}
              className="mb-2 p-5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="absolute right-6 top-5" />
            </button>

            <nav className="space-y-2">
              <NavLink to="/" onClick={toggleMenu} className={mobileNavLinkClass}>
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                About
              </NavLink>
              <NavLink
                to="/collections"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Collections
              </NavLink>
              <NavLink
                to="/contact"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Contact
              </NavLink>

              {/* Profile link */}
              <NavLink
                to="/login"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-semibold block px-3 py-2 text-base transition-colors duration-200"
                    : "text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium transition-colors duration-200"
                }
              >
                Profile
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
