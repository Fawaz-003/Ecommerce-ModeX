import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png"
import { ShoppingCart, User, Menu, X, Heart, Search } from "lucide-react";
import { getCart, getCartItemCount } from "../utils/cartUtils";
import { useAppContext } from "../Context/AppContext";
import SearchBar from "../Components/SearchBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePath, setProfilePath] = useState("/login");
  const [items, setItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { axios, user } = useAppContext();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Optionally clear the search bar after search
    }
  };

  // update profilePath whenever token/user changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("user-token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (token && user) {
        if (user.role === 0) {
          setProfilePath("/profile");
        } else if (user.role === 1) {
          setProfilePath("/admin/dashboard");
        } else {
          setProfilePath("/login");
        }
      } else {
        setProfilePath("/login");
      }
    };
    checkAuth();
    
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Update cart count on mount and when cart changes
  useEffect(() => {
    const updateCartCount = async () => {
      const cart = await getCart(axios);
      setItems(getCartItemCount(cart));
    };

    updateCartCount();
    
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, [user, axios]);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold px-3 py-2 text-sm transition-colors duration-200"
      : "text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold block px-3 py-2 text-base transition-colors duration-200"
      : "text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium transition-colors duration-200";

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex justify-center items-center h-[40px] overflow-hidden">
                <img src={Logo} className="h-[230px] w-auto my-[-95px] mx-[-40px]" alt="Logo" />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block md:ml-6">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
                <NavLink to="/collections" className={navLinkClass}>
                  Collections
                </NavLink>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center px-2 lg:ml-6">
            <form onSubmit={handleSearch} className="w-full max-w-lg lg:max-w-md">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative flex items-center">
                <input
                  id="search"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
                  placeholder="Search for products..."
                  type="search"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 bg-purple-600 rounded-r-md text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center">
            {/* Icons */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/profile/wishlist" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <Heart size={20} />
              </NavLink>
              <NavLink
                to="/cart"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
              >
                <ShoppingCart size={20} />
                {items > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 font-medium text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {items}
                  </span>
                )}
              </NavLink>
              <NavLink
                to={profilePath} // dynamic path here
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <User size={20} />
              </NavLink>
            </div>
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <SearchBar />
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden ${
          isMenuOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
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
              <NavLink
                to="/"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Home
              </NavLink>
              <NavLink
                to="/collections"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Collections
              </NavLink>

              {/* Profile link - also dynamic */}
              <NavLink
                to={profilePath}
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Profile
              </NavLink>
              <NavLink
                to="/profile/wishlist"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Wishlist
              </NavLink>
              <NavLink
                to="/cart"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Cart
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
