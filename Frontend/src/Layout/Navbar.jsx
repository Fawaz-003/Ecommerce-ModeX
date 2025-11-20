import React, { useState, useEffect, useMemo, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png"
import { ShoppingCart, User, Menu, X, Heart, Search, Clock, TrendingUp } from "lucide-react";
import { getCart, getCartItemCount } from "../utils/cartUtils";
import { useAppContext } from "../Context/AppContext";
import SearchBar from "../Components/SearchBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePath, setProfilePath] = useState("/login");
  const [items, setItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const { axios, user } = useAppContext();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle clicking outside the search container to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(storedSearches);
  }, []);

  const addSearchTermToRecent = (term) => {
    const cleanedTerm = term.trim().toLowerCase();
    if (!cleanedTerm) return;

    const updatedSearches = [cleanedTerm, ...recentSearches.filter(s => s !== cleanedTerm)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleSearch = (e, term) => {
    e.preventDefault();
    const query = (term || searchTerm).trim();
    if (query) {
      addSearchTermToRecent(query);
      navigate(`/collections?search=${encodeURIComponent(query)}`);
      setSearchTerm("");
      setIsSuggestionsOpen(false);
    }
  };

  // Fetch all products for suggestions
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get("/api/products/list"),
          axios.get("/api/category/list"),
        ]);
        const productsWithCategoryName = (productRes.data.products || []).map(p => ({...p, categoryName: (categoryRes.data.categories || []).find(c => c._id === p.category)?.name || 'Uncategorized' }));
        setAllProducts(productsWithCategoryName);
      } catch (error) {
        console.error("Failed to fetch products for suggestions:", error);
      }
    };
    fetchAllProducts();
  }, [axios]);

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

  const suggestedProducts = useMemo(() => {
    if (!searchTerm) return [];
    const lowercasedQuery = searchTerm.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(lowercasedQuery) ||
      p.brand.toLowerCase().includes(lowercasedQuery) ||
      p.categoryName.toLowerCase().includes(lowercasedQuery) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(lowercasedQuery))
    ).slice(0, 5); // Limit to 5 suggestions
  }, [searchTerm, allProducts]);

  const trendingSearches = ["wireless headphones", "running shoes", "smartwatch", "laptop", "t-shirt"];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex justify-center items-center h-[40px] overflow-hidden">
                <img src={Logo} className="h-[230px] w-auto" alt="Logo" />
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
          <div ref={searchContainerRef} className="flex-1 flex justify-center px-2 lg:ml-6 relative">
            <form onSubmit={(e) => handleSearch(e)} className="w-full max-w-lg lg:max-w-md">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative flex items-center">
                <input
                  id="search"
                  name="search"
                  value={searchTerm}
                  autoComplete="off"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSuggestionsOpen(true)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 sm:text-sm"
                  placeholder="Search for products..."
                  type="search"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 bg-indigo-600 rounded-r-md text-white hover:bg-indigo-700 focus:outline-none cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
            {/* Suggestions Dropdown */}
            {isSuggestionsOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-30 max-h-96 overflow-y-auto">
                {searchTerm && suggestedProducts.length > 0 && (
                  <div className="p-2">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Products</h3>
                    {suggestedProducts.map(product => (
                      <a key={product._id} href={`/collections?search=${encodeURIComponent(product.name)}`} onClick={(e) => handleSearch(e, product.name)} className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                        <img src={product.images[0]?.url} alt={product.name} className="w-10 h-10 object-contain mr-3 rounded-md bg-gray-50" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.categoryName}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {!searchTerm && recentSearches.length > 0 && (
                  <div className="p-2 border-b border-gray-100">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Searches</h3>
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <a key={index} href={`/collections?search=${encodeURIComponent(search)}`} onClick={(e) => handleSearch(e, search)} className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                        <Clock className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </a>
                    ))}
                  </div>
                )}

                {!searchTerm && (
                  <div className="p-2">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trending</h3>
                    {trendingSearches.map((trend, index) => (
                      <a key={index} href={`/collections?search=${encodeURIComponent(trend)}`} onClick={(e) => handleSearch(e, trend)} className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                        <TrendingUp className="h-4 w-4 text-red-400 mr-3" />
                        <span className="text-sm text-gray-700">{trend}</span>
                      </a>
                    ))}
                  </div>
                )}

                {searchTerm && suggestedProducts.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">No suggestions for "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
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
          isMenuOpen ? "" : "hidden"
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
