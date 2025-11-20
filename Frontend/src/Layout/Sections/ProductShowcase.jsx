import React from "react";
import ShowcaseCard from "./ShowcaseCard";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ProductShowcase = ({
  products = [],
  loading = false,
  error = null,
  title = "Products",
  link = "/collections",
}) => {
  if (loading) {
    return (
      <div className="lg:px-10 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  
  // Show a message if no products are found after loading
  if (!loading && products.length === 0) {
    return <div className="text-center py-10 text-gray-500">No products available at the moment.</div>;
  }

  return (
    <div className="bg-[#e8ecf0]">
      <div className="w-full">
        <div className="bg-[#c9e3cf] rounded-md sm:rounded-xl shadow-sm sm:shadow-lg p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <Link to={link} className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200">
              <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {products.map((product) => (
              <div key={product._id}>
                <ShowcaseCard product={product}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;