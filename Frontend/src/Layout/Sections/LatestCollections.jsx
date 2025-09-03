import ProductCard from "../../Components/ProductCard";
import { ChevronRight } from 'lucide-react';

const LatestCollections = () => {
  const products = [
    {
      id: 1,
      name: "Men Round Neck Pure Cotton T-shirt",
      price: 28,
      originalPrice: 40,
      rating: 4.5, 
      reviews: 124,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"
    },
    {
      id: 2,
      name: "Men Tapered Fit Flat-Front Trousers",
      price: 45,
      originalPrice: 72,
      rating: 4.3,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop"
    },
    {
      id: 3,
      name: "Women Round Neck Cotton Top",
      price: 22,
      originalPrice: 35,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop"
    },
    {
      id: 4,
      name: "Women Casual Denim Jacket",
      price: 55,
      originalPrice: 80,
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop"
    },
    {
      id: 5,
      name: "Men Slim Fit Casual Shirt",
      price: 35,
      originalPrice: 50,
      rating: 4.4,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop"
    },
  ];

  const handleWishlistToggle = (productId, isWishlisted) => {
    console.log(`Product ${productId} ${isWishlisted ? 'added to' : 'removed from'} wishlist`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header Section - Responsive Typography and Spacing */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
            <div className="h-[1px] sm:h-[1.2px] bg-gray-300 flex-1 max-w-[50px] sm:max-w-none"></div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 tracking-wide sm:tracking-wider px-2">
              LATEST COLLECTIONS
            </h1>
            <div className="h-[1px] sm:h-[1.2px] bg-gray-300 flex-1 max-w-[50px] sm:max-w-none"></div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4">
            Discover our latest dress collections, blending elegance and modern style. Perfectly crafted to keep you trendy, stylish, and comfortable always
          </p>
        </div>

        {/* Products Container - Responsive Layout */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-lg">
          {/* Header with responsive padding and button */}
          <div className="flex items-center justify-between p-4 sm:p-6 lg:p-5 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
              Featured Products
            </h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-2.5 lg:p-2 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md">
              <ChevronRight size={16} className="sm:w-5 sm:h-5 lg:w-5 lg:h-5" />
            </button>
          </div>
          
          {/* Products Grid - Comprehensive Responsive Grid */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestCollections;