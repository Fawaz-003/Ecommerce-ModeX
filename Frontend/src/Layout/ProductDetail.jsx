import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { Heart, IndianRupee, Star } from "lucide-react";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const [fetchProduct, setFetchProduct] = useState(null);
  const { axios } = useAppContext();
  const [thumbnail, setThumbnail] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetchSingleProduct();
  }, [productId]);

  const fetchSingleProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      const productData = response.data.product;
      console.log(productData);
      setFetchProduct(productData);
      setThumbnail(productData?.images?.[0]?.url);
      if (productData?.variant?.length > 0) {
        const firstColor = productData.variant[0].color;
        const firstSize = productData.variant[0].size;
        setSelectedColor(firstColor);
        setSelectedSize(firstSize);
        setSelectedVariant(productData.variant[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (selectedColor && selectedSize && fetchProduct?.variant?.length) {
      const match = fetchProduct.variant.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(match || null);
    }
  }, [selectedColor, selectedSize, fetchProduct]);

  if (!fetchProduct) {
    return <p className="p-6">Loading product...</p>;
  }

  const colors = [...new Set(fetchProduct.variant?.map((v) => v.color))];
  const sizes = [...new Set(fetchProduct.variant?.map((v) => v.size))];

  const averageRating =
    fetchProduct.reviews?.length > 0
      ? fetchProduct.reviews.reduce((acc, r) => acc + r.rating, 0) /
        fetchProduct.reviews.length
      : 0;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-7xl w-full px-6 py-2 lg:px-20 lg:py-8 bg-gray-50">
        <p>
          <span>Home</span> / <span> Products</span> /{" "}
          <span>{fetchProduct.subcategory}</span> /
          <span className="text-indigo-500"> {fetchProduct?.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {fetchProduct.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image.url)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-4xl mb-5 font-medium">{fetchProduct.name}</h1>

            <div className="flex items-center gap-1 mb-4">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-xs text-gray-500 ml-1">
                ({fetchProduct.reviews?.length || 0})
              </span>
            </div>

            {selectedVariant && (
              <div className="mb-4">
                <p className="text-3xl font-semibold text-gray-900 flex items-center gap-1">
                  <IndianRupee />
                  {selectedVariant.price}
                </p>
              </div>
            )}

            <div className="mt-6">
              {colors.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium mb-2">Color:</p>
                  <div className="flex gap-2">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          selectedColor === color
                            ? "border-black scale-110"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color);
                          const firstAvailableSize = fetchProduct.variant.find(
                            (v) => v.color === color
                          )?.size;

                          if (firstAvailableSize) {
                            setSelectedSize(firstAvailableSize);
                            setSelectedVariant(
                              fetchProduct.variant.find(
                                (v) =>
                                  v.color === color &&
                                  v.size === firstAvailableSize
                              )
                            );
                          }
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium mb-2">Size:</p>
                  <div className="flex gap-2">
                    {sizes.map((size, index) => {
                      const isAvailable = fetchProduct.variant.some(
                        (v) => v.color === selectedColor && v.size === size
                      );

                      return (
                        <button
                          key={index}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-lg border transition 
              ${
                selectedSize === size && isAvailable
                  ? "bg-indigo-500 text-white border-indigo-600"
                  : isAvailable
                  ? "border-gray-300 hover:bg-gray-100"
                  : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
                          onClick={() => isAvailable && setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedVariant && (
              <div className="mb-4">
                <p
                  className={`${
                    selectedVariant.quantity > 0
                      ? "text-blue-600"
                      : "text-red-500"
                  }`}
                >
                  {selectedVariant.quantity > 0
                    ? `Stocks lefted ${selectedVariant.quantity}`
                    : "Out of Stock"}
                </p>
              </div>
            )}
            <p className="text-base font-medium mt-6">About Product</p>
            <p className="text-gray-600">{fetchProduct.description}</p>

            <div className="flex items-center mt-10 gap-4 text-base">
              <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                Add to Cart
              </button>
              <button className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition">
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
