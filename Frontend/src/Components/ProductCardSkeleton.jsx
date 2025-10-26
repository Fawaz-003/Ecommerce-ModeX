const ProductCardSkeleton = () => {
  return (
    <div className="bg-white p-1 lg:p-1.5 rounded-lg shadow-sm border border-gray-100 flex flex-col animate-pulse">
      {/* Image Placeholder */}
      <div className="bg-gray-200 h-35 sm:h-56 lg:h-60 rounded-lg"></div>

      {/* Content Placeholder */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Title Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/5 mb-4"></div>

        {/* Price Placeholder */}
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>

        {/* Rating Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;