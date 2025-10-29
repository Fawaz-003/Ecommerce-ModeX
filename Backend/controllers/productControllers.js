import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModels.js";
import Category from "../models/categoryModels.js";
import UserProfile from "../models/userProfileModels.js";

const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    const categoryId = productData.category;
    const fetchCategoryData = await Category.findById(categoryId);
    const categoryName = fetchCategoryData.name;
    const categoryFolder = categoryName.replace(/[^a-zA-Z0-9]/g, "_");
    const subCategoryFolder = productData.subcategory;

    let imagesUrl = await Promise.all(
      images.map(async (image) => {
        let result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
          folder: `Ecommerce_ModeX/products/${categoryFolder}/${subCategoryFolder}`,
        });
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      })
    );

    await Product.create({ ...productData, images: imagesUrl });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: { ...productData, images: imagesUrl },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    let productData = JSON.parse(req.body.productData);
    const categoryId = productData.category;
    const fetchCategoryData = await Category.findById(categoryId);
    const categoryName = fetchCategoryData.name;
    const categoryFolder = categoryName.replace(/[^a-zA-Z0-9]/g, "_");
    const subCategoryFolder = productData.subcategory;

    let removeImages = [];
    if (req.body.removeImages) {
      removeImages = JSON.parse(req.body.removeImages);
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    let remainingImages = existingProduct.images;
    if (removeImages.length > 0) {
      for (const img of removeImages) {
        try {
          if (img?.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
      remainingImages = existingProduct.images.filter(
        (img) => !removeImages.some((rm) => rm.public_id === img.public_id)
      );
    }

    let newImagesObjects = [];
    if (req.files && req.files.length > 0) {
      newImagesObjects = await Promise.all(
        req.files.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
            folder: `Ecommerce_ModeX/products/${categoryFolder}/${subCategoryFolder}`,
          });
          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        })
      );
    }

    const updatedFields = { ...productData };
    updatedFields.images = [...remainingImages, ...newImagesObjects];

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    for (const img of existingProduct.images) {
      try {
        if (img?.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const ProductList = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const fetchProduct = await Product.findById(productId).populate(
      "reviews.userId",
      "name avatar"
    );

    if (!fetchProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: fetchProduct,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWishlistProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No product IDs provided" });
    }

    const products = await Product.find({ _id: { $in: ids } });

    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?._id || req.body.userId; 
    if (!rating || !comment) {
      console.log("Validation failed: Rating and comment are required.");
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      console.log(`Product not found for ID: ${productId}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.userId.toString() === userId.toString()
    );

    const userProfile = await UserProfile.findOne({ user: userId });
    if (!userProfile) {
      // This case is unlikely if profiles are created on registration, but it's good practice to handle it.
      console.log(`User profile not found for user ID: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    const reviewForUserProfile = {
      product: productId,
      productName: product.name,
      productImage: product.images[0]?.url,
      rating,
      comment,
      createdAt: new Date(),
    };

    const alreadyReviewedInProfile = userProfile.reviews.find(
      (rev) => rev.product?.toString() === productId.toString()
    );

    if (alreadyReviewed) {
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = comment;
      alreadyReviewed.date = new Date();

      if (alreadyReviewedInProfile) {
        alreadyReviewedInProfile.rating = rating;
        alreadyReviewedInProfile.comment = comment;
        alreadyReviewedInProfile.createdAt = new Date();
      } else {
        // This would be a data inconsistency, but we can fix it by adding it.
        userProfile.reviews.push(reviewForUserProfile);
      }
    } else {
      const review = { userId, rating, comment };
      product.reviews.push(review);
      userProfile.reviews.push(reviewForUserProfile);
    }

    const total = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const avgRating = total / product.reviews.length;
    product.averageRating = avgRating;

    await Promise.all([product.save(), userProfile.save()]);

    res.status(200).json({
      success: true,
      message: alreadyReviewed
        ? "Review updated successfully"
        : "Review added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding review",
    });
  }
};

export { addProduct, updateProduct, ProductList, singleProduct, deleteProduct, getWishlistProducts, addReview };
