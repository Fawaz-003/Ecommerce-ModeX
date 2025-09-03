import React, { useState, useMemo } from 'react';
import { Search, Filter, Heart, Star, ChevronRight } from 'lucide-react';

// Your existing ProductCard Component
const ProductCard = ({ product, onWishlistToggle }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    onWishlistToggle && onWishlistToggle(product.id, !isWishlisted);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    console.log(`Added product ${product.id} to cart`);
    // You can add your cart logic here
  };

  return (
    <div className="bg-white p-1 rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 group border border-gray-100 h-[260px] sm:h-[450px] lg:h-[380px] flex flex-col">
      {/* Image Container - Fixed Heights */}
      <div className="relative bg-gray-100 h-35 sm:h-56 lg:h-60 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Heart Icon - Responsive Positioning */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white hover:cursor-pointer rounded-full shadow-md hover:shadow-lg transition-all duration-200 z-10"
        >
          <Heart
            size={16}
            className={`sm:w-[18px] sm:h-[18px] ${
              isWishlisted
                ? 'text-red-500 fill-current'
                : 'text-gray-400 hover:text-red-400'
            } transition-colors duration-200`}
          />
        </button>
      </div>
      
      {/* Product Info - Responsive Padding and Typography */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-800 text-sm sm:text-base mb-1 line-clamp-2 leading-relaxed min-h-[2rem] sm:min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price - Responsive Typography */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        {/* Star Rating - Responsive Size */}
        <div className="flex items-center gap-1 mb-1">
          <div className="flex">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews})
          </span>
        </div>
      </div>
    </div>
  );
};

const Collections = () => {
  // Sample product data - Updated to match your ProductCard structure
  const allProducts = [
    { 
      id: 1, 
      name: "Premium Wireless Noise-Cancelling Headphones", 
      price: 199, 
      originalPrice: 249,
      category: "Electronics", 
      brand: "TechPro", 
      rating: 4.5, 
      reviews: 234,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 2, 
      name: "Professional Running Shoes for Athletes", 
      price: 129, 
      category: "Sports", 
      brand: "RunFast", 
      rating: 4.2, 
      reviews: 156,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 3, 
      name: "Smart Coffee Maker with App Control", 
      price: 89, 
      originalPrice: 120,
      category: "Home", 
      brand: "BrewMaster", 
      rating: 4.7, 
      reviews: 89,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop", 
      inStock: false 
    },
    { 
      id: 4, 
      name: "Latest Smartphone with 5G Technology", 
      price: 699, 
      category: "Electronics", 
      brand: "TechPro", 
      rating: 4.3, 
      reviews: 512,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 5, 
      name: "Eco-Friendly Yoga Mat with Alignment Guide", 
      price: 45, 
      category: "Sports", 
      brand: "FitLife", 
      rating: 4.6, 
      reviews: 78,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 6, 
      name: "Adjustable LED Desk Lamp with USB Charging", 
      price: 79, 
      category: "Home", 
      brand: "LightUp", 
      rating: 4.1, 
      reviews: 45,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 7, 
      name: "Portable Bluetooth Speaker Waterproof", 
      price: 149, 
      category: "Electronics", 
      brand: "SoundWave", 
      rating: 4.4, 
      reviews: 167,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 8, 
      name: "Insulated Winter Jacket for Outdoor Activities", 
      price: 159, 
      originalPrice: 199,
      category: "Clothing", 
      brand: "WarmTech", 
      rating: 4.5, 
      reviews: 92,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 9, 
      name: "RGB Gaming Mouse with Precision Sensor", 
      price: 69, 
      category: "Electronics", 
      brand: "GamePro", 
      rating: 4.8, 
      reviews: 203,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 10, 
      name: "Insulated Stainless Steel Water Bottle", 
      price: 25, 
      category: "Sports", 
      brand: "HydroFlex", 
      rating: 4.3, 
      reviews: 134,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 11, 
      name: "Travel Backpack with Laptop Compartment", 
      price: 89, 
      category: "Clothing", 
      brand: "TravelPro", 
      rating: 4.2, 
      reviews: 67,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", 
      inStock: true 
    },
    { 
      id: 12, 
      name: "High-Speed Kitchen Blender for Smoothies", 
      price: 119, 
      originalPrice: 149,
      category: "Home", 
      brand: "BlendMaster", 
      rating: 4.6, 
      reviews: 156,
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop", 
      inStock: false 
    }
  ];

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Get unique values for filters
  const categories = [...new Set(allProducts.map(p => p.category))];
  const brands = [...new Set(allProducts.map(p => p.brand))];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      
      // Stock filter
      if (showInStockOnly && !product.inStock) return false;
      
      // Rating filter
      if (product.rating < minRating) return false;
      
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    return filtered;
  }, [allProducts, priceRange, selectedCategories, selectedBrands, showInStockOnly, minRating, searchQuery, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleWishlistToggle = (productId, isAdded) => {
    console.log(`Product ${productId} ${isAdded ? 'added to' : 'removed from'} wishlist`);
  };

  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setShowInStockOnly(false);
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Filters */}
      <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter className="mr-2" size={20} />
            Filters
          </h2>
          <button 
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                placeholder="Min"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                placeholder="Max"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="px-1">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$1000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Brands</label>
          <div className="space-y-2">
            {brands.map(brand => (
              <label key={brand} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value={0}>Any Rating</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>

        {/* In Stock Only */}
        <div className="mb-6">
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={(e) => setShowInStockOnly(e.target.checked)}
              className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
              In Stock Only
            </span>
          </label>
        </div>

        {/* Active Filters Summary */}
        {(selectedCategories.length > 0 || selectedBrands.length > 0 || showInStockOnly || minRating > 0 || searchQuery) && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(cat => (
                <span key={cat} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {cat}
                </span>
              ))}
              {selectedBrands.map(brand => (
                <span key={brand} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {brand}
                </span>
              ))}
              {showInStockOnly && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  In Stock
                </span>
              )}
              {minRating > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {minRating}+ Stars
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">All Products</h1>
            <p className="text-gray-600">
              {filteredProducts.length} of {allProducts.length} products
            </p>
          </div>
          
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any products matching your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Clear All Filters
              <ChevronRight className="ml-2" size={16} />
            </button>
          </div>
        )}

        {/* Results Footer */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Showing {filteredProducts.length} of {allProducts.length} products
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;