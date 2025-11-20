import React, { useState, useEffect } from 'react';
import ProductCard from '../../Components/ProductCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const RecentlyViewed = () => {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    setViewedProducts(storedProducts);
  }, []);

  if (viewedProducts.length === 0) {
    return null; // Don't render the section if there are no recently viewed items
  }

  return (
    <div className="bg-[#e8ecf0] py-8 sm:py-12 lg:py-5 lg:px-10">
      <div className="w-full">
        <div className="bg-[#cdd5ef] rounded-md sm:rounded-xl shadow-sm sm:shadow-lg">
          <div className="flex items-center justify-between p-4 lg:p-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Things You Looked At
            </h2>
            <Link to="/collections?filter=recently-viewed" className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200">
              <ChevronRight size={20} />
            </Link>
          </div>

          <div className="lg:px-5 lg:pb-5">
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {viewedProducts.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;