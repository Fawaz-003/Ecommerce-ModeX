import React from "react";
import { IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShowcaseCard = ({ product, isLarge = false }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const displayPrice = product.variant?.[0]?.price || product.price || 0;

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-100 h-full rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer flex flex-col"
    >
      <div className={`relative w-full overflow-hidden flex-grow ${isLarge ? 'h-64 sm:h-80' : 'h-40 sm:h-48'}`}>
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-contain object-center transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-3 sm:p-4 bg-white">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate mb-1">
          {product.name}
        </h3>
        <p className="flex items-center text-base sm:text-lg font-bold text-gray-900">
          <IndianRupee size={16} className="mr-0.5" />
          {displayPrice.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ShowcaseCard;
