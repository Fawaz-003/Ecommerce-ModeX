import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModels.js"; 

export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (image) => {
        let result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
          folder: "Ecommerce_ModeX/products",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, images: imagesUrl });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const ProductList = async (req, res) => {
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

export const ProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const fetchProduct = await Product.findById(id);

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
