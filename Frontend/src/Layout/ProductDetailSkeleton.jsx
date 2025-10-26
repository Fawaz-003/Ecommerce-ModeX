import React from "react";
import ProductReviewsSkeleton from "./ProductReviewsSkeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="flex justify-center animate-pulse">
      <div className="max-w-7xl w-full px-6 py-2 lg:px-20 lg:py-8 bg-gray-50">
        {/* Breadcrumbs */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>

        <div className="flex flex-col md:flex-row gap-16 mt-8">
          {/* Image Section */}
          <div className="flex gap-3 w-full md:w-1/2">
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="border bg-gray-300 w-24 h-24 rounded"
                ></div>
              ))}
            </div>
            <div className="border bg-gray-300 flex-1 h-[450px] rounded"></div>
          </div>

          {/* Details Section */}
          <div className="text-sm w-full md:w-1/2 space-y-5">
            <div className="flex justify-between items-start">
              <div className="h-10 bg-gray-300 rounded w-3/4"></div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-10"></div>
            </div>

            <div className="h-8 bg-gray-300 rounded w-1/3"></div>

            <div className="space-y-4 pt-4">
              {/* Color options */}
              <div>
                <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Size options */}
              <div>
                <div className="h-4 bg-gray-300 rounded w-12 mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-300 rounded-lg w-16"></div>
                  <div className="h-10 bg-gray-300 rounded-lg w-16"></div>
                </div>
              </div>
            </div>

            <div className="h-4 bg-gray-300 rounded w-1/4 pt-4"></div>

            <div className="pt-4">
              <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>

            <div className="flex items-center pt-6 gap-4 text-base">
              <div className="w-full h-12 bg-gray-300 rounded"></div>
              <div className="w-full h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="mt-12 py-8 border-t border-gray-200">
          <ProductReviewsSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;