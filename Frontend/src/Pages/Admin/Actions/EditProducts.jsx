import { useState, useEffect } from "react";
import { useAppContext } from "../../../Context/AppContext";
import {
  ArrowLeft,
  Badge,
  FileText,
  IndianRupee,
  Package,
  Plus,
  Tag,
  Upload,
  X,
  Save,
  AlertCircle,
  Layers,
  Settings,
} from "lucide-react";
import { Await, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditProducts = () => {
  const { id } = useParams();

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    isfeatured: false,
    instock: true,
  });

  const categories = [
    "Mobiles & Tablets",
    "Fashion",
    "Laptops",
    "Home & Furniture",
    "TVs & Appliances",
    "Headsets & Airpods",
  ];

  const subcategories = [
    "shoes",
    "clothing",
    "accessories",
    "smartphones",
    "tablets",
    "laptops",
    "headphones",
    "speakers",
  ];

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [variants, setVariants] = useState([
    { size: "", color: "", quantity: "" },
  ]);
  const { axios } = useAppContext();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        const product = res.data.product;
        setProductData({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          subcategory: product.subcategory || "",
          brand: product.brand,
          isfeatured: product.isfeatured || false,
          instock: product.instock !== undefined ? product.instock : true,
        });

        // Set variants if they exist
        if (product.variant && product.variant.length > 0) {
          setVariants(
            product.variant.map((v) => ({
              size: v.size || "",
              color: v.color || "",
              quantity: v.quantity || "",
            }))
          );
        }

        setImages(
          product.images && product.images.length > 0
            ? product.images.map((imgObj) => ({
                preview: imgObj.url,
                name: imgObj.public_id || imgObj.url.split("/").pop(),
                public_id: imgObj.public_id,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Error fetching product data");
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoryId = productData.category;
      const categoryres = await axios.get(`api/category/single/${categoryId}`);
      console.log(categoryres.data);
      console.log(categoryId)
    } catch (error) {
      console.log(error)
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { size: "", color: "", quantity: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [
            ...prev,
            {
              file: file,
              preview: e.target.result,
              name: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveExistingImage = (index) => {
    const img = images[index];

    if (!img.file && img.public_id) {
      setRemovedImages((prev) => [
        ...prev,
        { public_id: img.public_id, url: img.preview },
      ]);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!productData.name.trim()) newErrors.name = "Product name is required";
    if (!productData.price || productData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!productData.brand.trim()) newErrors.brand = "Brand is required";
    if (!productData.description.trim())
      newErrors.description = "Description is required";
    if (!productData.category) newErrors.category = "Category is required";
    if (!productData.subcategory)
      newErrors.subcategory = "Subcategory is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      const newImages = images.filter((img) => img.file).map((img) => img.file);

      // Include variants in the product data
      const completeProductData = {
        ...productData,
        variant: variants.filter((v) => v.size || v.color || v.quantity), // Only include non-empty variants
      };

      formData.append("productData", JSON.stringify(completeProductData));
      formData.append("removeImages", JSON.stringify(removedImages));

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.put(`/api/products/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving changes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Edit Product
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Update your product information
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-white bg-opacity-20 text-gray-700 font-medium rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4" />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <IndianRupee className="w-4 h-4" />
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.price
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Badge className="w-4 h-4" />
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.brand
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter brand name"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.brand}
                  </p>
                )}
              </div>
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Category *
                </label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.category
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Layers className="w-4 h-4" />
                  Subcategory *
                </label>
                <select
                  name="subcategory"
                  value={productData.subcategory}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.subcategory
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.subcategory && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.subcategory}
                  </p>
                )}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Settings className="w-4 h-4" />
                Product Settings
              </label>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isfeatured"
                    checked={productData.isfeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      Featured Product
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="instock"
                    checked={productData.instock}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">In Stock</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Description *
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Latest Apple phone with advanced features..."
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Product Variants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Package className="w-4 h-4" />
                  Product Variants
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>

              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-gray-300 rounded-lg mb-3 border"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(index, "size", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., XL, 42, 256GB"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., Red, Black, Blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) =>
                        handleVariantChange(index, "quantity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex items-end">
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="w-full px-3 py-2 text-red-50 border bg-red-500 border-red-600 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Images Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4" />
                Product Images (Upload up to 4 images)
              </label>

              <div className="space-y-4">
                {/* Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={images.length >= 4}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                      images.length >= 4
                        ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                        : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-center">
                      <Plus
                        className={`w-8 h-8 mx-auto mb-2 ${
                          images.length >= 4 ? "text-gray-300" : "text-blue-400"
                        }`}
                      />
                      <p
                        className={`${
                          images.length >= 4 ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {images.length >= 4
                          ? "Maximum 4 images reached"
                          : "Click to upload images or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {images.length}/4 images uploaded • PNG, JPG, WebP
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-500 mt-2 truncate px-1">
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProducts;
