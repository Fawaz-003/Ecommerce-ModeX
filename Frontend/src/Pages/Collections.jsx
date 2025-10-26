import MobileFilter from "../Layout/MobileFilter";
import MobileSort from "../Layout/MobileSort";
import { useState, useMemo } from "react";
import { Search, Filter, ChevronRight } from "lucide-react";
import ProductCard from "../Components/ProductCard";
import { useEffect } from "react";
import { useAppContext } from "../Context/AppContext";

const Collections = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Get unique values for filters
  const categories = [...new Set(allProducts.map((p) => p.category))];
  const brands = [...new Set(allProducts.map((p) => p.brand))];
  const { axios, user } = useAppContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products/list"); // adjust endpoint
        const list = res.data.products; // depends on your API response
        setAllProducts(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axios]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1])
        return false;

      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      )
        return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand))
        return false;

      // Stock filter
      if (showInStockOnly && !product.inStock) return false;

      // Rating filter
      if (product.rating < minRating) return false;

      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    allProducts,
    priceRange,
    selectedCategories,
    selectedBrands,
    showInStockOnly,
    minRating,
    searchQuery,
    sortBy,
  ]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };


  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setShowInStockOnly(false);
    setMinRating(0);
    setSearchQuery("");
  };

  const openMobileFilter = () => {
    setIsMobileFilterOpen(true);
    setHideBottomNavForFilter(true);
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
    setHideBottomNavForFilter(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 bg-white shadow-lg p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter className="mr-2" size={20} /> Filters
          </h2>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range
          </label>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
              }
              placeholder="Min"
              className="w-24 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])
              }
              placeholder="Max"
              className="w-24 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categories
          </label>
          <div className="space-y-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <label key={cat} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 hover:text-gray-800">
                    {cat}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No categories found</p>
            )}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Brands
          </label>
          <div className="space-y-2">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <label key={brand} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 hover:text-gray-800">
                    {brand}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No brands found</p>
            )}
          </div>
        </div>

        {/* Rating & In Stock */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Any Rating</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={(e) => setShowInStockOnly(e.target.checked)}
              className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 hover:text-gray-800">
              In Stock Only
            </span>
          </label>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 lg:px-8">
        {/* Mobile Filter & Sort Row */}
        <div className="lg:hidden h-10 w-30 absolute right-1 mb-4 px-4">
          {/* Sort Button on Left */}

          {/* Filter Button on Right */}
          <span
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer"
          >
            <Filter className="mr-2" size={16} /> Filter
          </span>
        </div>

        {/* Conditional Mobile Sort Options */}
        {showSort && <MobileSort sortBy={sortBy} setSortBy={setSortBy} />}

        {/* Sort Section */}
        <div className="mb-6">
          {/* Desktop Sort */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white w-auto"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* ✅ Mobile Sort Component */}
          <div className="lg:hidden flex justify-between items-center mb-4 px-4"></div>
          <MobileSort sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <p className="text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any products matching your current filters. Try
              adjusting your search criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear All Filters <ChevronRight className="ml-2" size={16} />
            </button>
          </div>
        )}

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <MobileFilter
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            brands={brands}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            showInStockOnly={showInStockOnly}
            setShowInStockOnly={setShowInStockOnly}
            minRating={minRating}
            setMinRating={setMinRating}
            clearAllFilters={clearAllFilters}
            onClose={() => setIsMobileFilterOpen(close)}
          />
        )}

        {/* Footer */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Showing {filteredProducts.length} of {allProducts.length} products
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Collections;
