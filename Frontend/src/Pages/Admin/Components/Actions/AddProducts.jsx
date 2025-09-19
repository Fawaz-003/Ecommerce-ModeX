import React, { useState } from "react";
import {
  Upload,
  X,
  Plus,
  Package,
  IndianRupee,
  Badge,
  FileText,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";

const AddProducts = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
  });

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Mobiles & Tablets",
    "Fashion",
    "Laptops",
    "Home & Furniture",
    "TVs & Appliances",
    "Headsets & Airpods",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      alert("Maximum 4 images allowed");
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

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "productData",
        JSON.stringify({
          name: productData.name,
          price: parseInt(productData.price),
          description: productData.description,
          category: productData.category,
          brand: productData.brand,
        })
      );

      images.forEach((image, index) => {
        formData.append("images", image.file);
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/add`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          position: "top-right",
          style: { margin: "45px" },
        });
        setProductData({ name: "", price: "", description: "", category: "", brand: "" });
        setImages([]);
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(err.message, {
        position: "top-right",
        style: { margin: "45px" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
        </div>
        <div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-[#ee9b00] text-gray-950 font-medium rounded-lg hover:bg-[#eda521] hover:cursor-pointer transition"
          >
            <ArrowLeft className="inline w-5 h-5 mr-2 mb-1" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex w-full gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4" />
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <IndianRupee className="w-4 h-4" />
              Price
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Badge className="w-4 h-4" />
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4" />
            Category
          </label>
          <select
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            Description
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            placeholder="Latest Apple phone with advanced features..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Upload className="w-4 h-4" />
            Product Images (upload upto 4 images)
          </label>

          <div className="space-y-4">
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
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {images.length >= 4
                      ? "Maximum 4 images"
                      : "Click to upload images"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {images.length}/4 images uploaded
                  </p>
                </div>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {image.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || images.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding Product...
            </div>
          ) : (
            "Add Product"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddProducts;
