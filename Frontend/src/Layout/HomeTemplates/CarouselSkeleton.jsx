import React from 'react';

const CarouselSkeleton = () => {
  return (
    <div className="relative w-full h-full bg-gray-200 animate-pulse flex items-center justify-center overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gray-300 flex flex-col items-center justify-center p-4">
        <div className="h-8 bg-gray-400 rounded w-3/4 mb-4"></div>
        <div className="h-5 bg-gray-400 rounded w-1/2 mb-6"></div>
        <div className="h-12 bg-gray-400 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default CarouselSkeleton;