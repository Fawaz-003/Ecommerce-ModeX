import React, { useState, useEffect } from "react";
import { useAppContext } from "../Context/AppContext";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  Loader,
} from "lucide-react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { axios } = useAppContext();
  const productId = useParams().id;

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${productId}`);
      const data = response.data.data || response.data;
      console.log(data);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button
            onClick={fetchProduct}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentVariant = product.variant?.[selectedVariant];
  const avgRating =
    product.reviews?.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
                >
                  <Heart
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images?.map((img, idx) => (
                  <button
                    key={img._id}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="text-xs sm:text-sm text-gray-500 mb-1">
                  {product.brand}
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                {product.reviews?.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm">
                      <span>{avgRating.toFixed(1)}</span>
                      <Star className="w-3 h-3 fill-white" />
                    </div>
                    <span className="text-gray-600 text-xs sm:text-sm">
                      {product.reviews.length}{" "}
                      {product.reviews.length === 1 ? "Review" : "Reviews"}
                    </span>
                  </div>
                )}
              </div>

              {currentVariant && (
                <div className="border-t border-b py-3 sm:py-4">
                  <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      ₹{currentVariant.price}
                    </span>
                    <span className="text-base sm:text-lg text-gray-500 line-through">
                      ₹{Math.round(currentVariant.price * 1.3)}
                    </span>
                    <span className="text-sm sm:text-base text-green-600 font-semibold">
                      23% off
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Inclusive of all taxes
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.variant?.length > 0 && (
                <>
                  <div>
                    <div className="font-semibold mb-2 text-sm sm:text-base">
                      Size: {currentVariant?.size}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {product.variant.map((v, idx) => (
                        <button
                          key={v._id}
                          onClick={() => setSelectedVariant(idx)}
                          className={`px-3 sm:px-4 py-2 border-2 rounded-lg font-medium text-sm sm:text-base ${
                            selectedVariant === idx
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {v.size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentVariant?.color && (
                    <div>
                      <div className="font-semibold mb-2 text-sm sm:text-base">
                        Color: {currentVariant.color}
                      </div>
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300"
                        style={{
                          backgroundColor: currentVariant.color.toLowerCase(),
                        }}
                      ></div>
                    </div>
                  )}
                </>
              )}

              {/* Quantity */}
              {currentVariant && (
                <div>
                  <div className="font-semibold mb-2 text-sm sm:text-base">
                    Quantity
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-lg font-bold hover:bg-gray-100 text-sm sm:text-base"
                    >
                      -
                    </button>
                    <span className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(currentVariant.quantity, quantity + 1)
                        )
                      }
                      className="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-lg font-bold hover:bg-gray-100 text-sm sm:text-base"
                    >
                      +
                    </button>
                    <span className="text-xs sm:text-sm text-gray-600">
                      ({currentVariant.quantity} available)
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add to Cart
                </button>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base">
                  Buy Now
                </button>
                <button className="sm:px-4 py-2.5 sm:py-0 border-2 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Benefits */}
              <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <span>Free Delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <span>7 Days Return & Exchange</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <span>100% Original Products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Product Description
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Customer Reviews
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm">
                        <span>{review.rating}</span>
                        <Star className="w-3 h-3 fill-white" />
                      </div>
                      <span className="font-semibold text-sm sm:text-base">
                        Anonymous User
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">
                      {review.comment}
                    </p>
                    <div className="text-xs sm:text-sm text-gray-500 mt-2">
                      {review.date
                        ? new Date(review.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No date provided"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
