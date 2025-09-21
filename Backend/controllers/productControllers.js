import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModels.js";

const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    const category = productData.category;
    const categoryFolder = category.replace(/[^a-zA-Z0-9]/g, "_");

    let imagesUrl = await Promise.all(
      images.map(async (image) => {
        let result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
          folder: `Ecommerce_ModeX/products/${categoryFolder}`,
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, images: imagesUrl });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: { ...productData },
      images: { imagesUrl },
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

    const exisingProduct = await Product.findById(productId);
    if (!exisingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    let imagesUrl = [];
    if (req.files && req.files.length > 0) {
      const category = productData.category || exisingProduct.category;
      const categoryFolder = category.replace(/[^a-zA-Z0-9]/g, "_");

      imagesUrl = await Promise.all(
        req.files.map(async (image) => {
          let result = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
            folder: `Ecommerce_ModeX/products/${categoryFolder}`,
          });
          return result.secure_url;
        })
      );
    }

    const updatedFields = { ...exisingProduct._doc, ...productData };

    if (imagesUrl.length > 0) {
      updatedFields.images = [...exisingProduct.images, ...imagesUrl];
    }

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
    const fetchProduct = await Product.findById(productId);

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

export { addProduct, updateProduct, ProductList, singleProduct };
