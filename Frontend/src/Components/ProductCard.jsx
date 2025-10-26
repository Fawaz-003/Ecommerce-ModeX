import { useState } from "react";
import { Heart, IndianRupee, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { wishlist, addToWishlist, removeFromWishlist, user } = useAppContext();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const isWishlisted = wishlist.includes(product._id);

  const handleWishlistClick = async (e) => {
    e.stopPropagation(); // prevent card navigation

    if (!user) {
      navigate("/login");
      return;
    }

    if (isUpdating) return; // Prevent multiple clicks
    setIsUpdating(true);

    const toastOptions = {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      style: { margin: "45px", zIndex: 9999 },
    };

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        toast.info("Removed from wishlist", toastOptions);
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist!", toastOptions);
      }
    } catch (error) {
      toast.error("Something went wrong.", toastOptions);
      console.error("Wishlist update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const averageRating =
    product.reviews?.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white p-1 lg:p-1.5 rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 group border border-gray-100 flex flex-col"
    >
      <div className="relative bg-gray-100 h-35 sm:h-56 lg:h-60 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white hover:cursor-pointer rounded-full shadow-md hover:shadow-lg transition-all duration-200 z-10"
        >
          {isUpdating ? (
            <Loader2
              size={16}
              className="sm:w-[18px] sm:h-[18px] text-gray-400 animate-spin"
            />
          ) : (
            <Heart
              size={16}
              className={`sm:w-[18px] sm:h-[18px] ${
                isWishlisted
                  ? "text-red-500 fill-current"
                  : "text-gray-400 hover:text-red-400"
              } transition-colors duration-200`}
            />
          )}
        </button>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-800 text-[12px] lg:text-[14px] sm:text-base line-clamp-2 leading-relaxed min-h-[2rem] sm:min-h-[3rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="flex items-center text-base sm:text-lg text-[14px] lg:text-[16px] font-bold text-gray-900">
            <IndianRupee width={15} height={15} />
            {product.variant[0].price}
          </span>
        </div>

        {/* Star Rating - Responsive Size */}
        <div className="flex items-center gap-1">
          <div className="flex">{renderStars(averageRating)}</div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews?.length || 0})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
