import ProductCard from "../../Components/ProductCard.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext.jsx";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton.jsx";
import { ChevronRight } from "lucide-react";
 
const LatestCollections = () => {
  const [products, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { axios } = useAppContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products/list"); // adjust endpoint
        let list = res.data.products.filter((product) => {
          if (!product.reviews || product.reviews.length === 0) {
            return false;
          }
          const totalRating = product.reviews.reduce(
            (acc, review) => acc + review.rating, 0
          );
          product.averageRating = totalRating / product.reviews.length; // Store average rating for sorting
          return product.averageRating >= 4;
        });

        // Sort products by average rating in descending order
        list.sort((a, b) => b.averageRating - a.averageRating);

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

  return (
    <div className="bg-[#e8ecf0] py-8 sm:py-12 lg:py-5 lg:px-10">
      <div className="w-full">
        {/* Products Container - Responsive Layout */}
        <div className="bg-[#ecdadc] rounded-md sm:rounded-xl shadow-sm sm:shadow-lg">
          <div className="flex items-center justify-between p-4 lg:p-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Top Rated Products
            </h2>
            <Link to="/collections?filter=top-rated" className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200">
              <ChevronRight size={20} />
            </Link>
          </div>

          {/* Products Grid - Comprehensive Responsive Grid */}
          <div className="lg:px-5 lg:pb-5">
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {/* Loading State */}
              {loading && (
                [...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)
              )}

              {!loading && error && (
                <div className="text-center py-16">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {!loading && !error && products.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestCollections;
