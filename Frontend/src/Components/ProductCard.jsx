import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';

// Responsive ProductCard Component
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
    <div className="bg-white p-1 lg:p-1.5 rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 group border border-gray-100 flex flex-col">
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
        <h3 className="font-medium text-gray-800 text-[12px] lg:text-[14px] sm:text-base line-clamp-2 leading-relaxed min-h-[2rem] sm:min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price - Responsive Typography */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-base sm:text-lg text-[14px] lg:text-[16px] font-bold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        {/* Star Rating - Responsive Size */}
        <div className="flex items-center gap-1">
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

export default ProductCard;