// cartControllers.js - FIXED VERSION

import UserProfile from "../models/userProfileModels.js";
import productModel from "../models/productModels.js"; // Import the product model
import mongoose from "mongoose";

const getCart = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user._id }).populate({
      path: "cart.product",
      model: "product" // Use lowercase "product" to match your model registration
    });
    
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    
    res.status(200).json(userProfile.cart || []);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color, price } = req.body;
    
    console.log("Received cart data:", { productId, quantity, size, color, price });
    
    // Validate required fields
    if (!productId || !quantity || !size || !color || !price) {
      return res.status(400).json({ 
        message: "Missing required fields: productId, quantity, size, color, price" 
      });
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Verify product exists
    const productExists = await productModel.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find by user field, not _id
    let userProfile = await UserProfile.findOne({ user: req.user._id });
    
    if (!userProfile) {
      console.log("Creating new user profile for user:", req.user._id);
      // Create user profile if it doesn't exist
      userProfile = new UserProfile({
        user: req.user._id,
        cart: []
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = userProfile.cart.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex !== -1) {
      console.log("Updating existing item quantity");
      // Update quantity if item exists
      userProfile.cart[existingItemIndex].quantity += quantity;
    } else {
      console.log("Adding new item to cart");
      // Add new item to cart
      userProfile.cart.push({ 
        product: productId, 
        quantity, 
        size, 
        color, 
        price 
      });
    }

    await userProfile.save();
    console.log("Cart saved successfully");
    
    // Populate cart before sending response
    await userProfile.populate({
      path: "cart.product",
      model: "product" // Use lowercase "product"
    });
    
    res.status(200).json({ 
      message: "Added to cart successfully", 
      cart: userProfile.cart 
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Error adding to cart", 
      error: error.message 
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, size, color } = req.body;

    // Validate required fields
    if (!quantity || !size || !color) {
      return res.status(400).json({ 
        message: "Missing required fields: quantity, size, color" 
      });
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const userProfile = await UserProfile.findOne({ user: req.user._id });
    
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Find the specific cart item
    const itemIndex = userProfile.cart.findIndex(
      (item) => 
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (itemIndex !== -1) {
      userProfile.cart[itemIndex].quantity = quantity;
      await userProfile.save();
      
      // Populate cart before sending response
      await userProfile.populate({
        path: "cart.product",
        model: "product" // Use lowercase "product"
      });
      
      res.status(200).json({ 
        message: "Quantity updated successfully", 
        cart: userProfile.cart 
      });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ 
      message: "Error updating quantity", 
      error: error.message 
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, color } = req.body;

    // Validate required fields
    if (!size || !color) {
      return res.status(400).json({ 
        message: "Missing required fields: size, color" 
      });
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const userProfile = await UserProfile.findOne({ user: req.user._id });
    
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Remove the specific item from cart
    userProfile.cart = userProfile.cart.filter(
      (item) => !(
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
      )
    );

    await userProfile.save();
    
    // Populate cart before sending response
    await userProfile.populate({
      path: "cart.product",
      model: "product" // Use lowercase "product"
    });
    
    res.status(200).json({ 
      message: "Item removed successfully", 
      cart: userProfile.cart 
    });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ 
      message: "Error removing item", 
      error: error.message 
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user._id });
    
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    
    userProfile.cart = [];
    await userProfile.save();
    
    res.status(200).json({ 
      message: "Cart cleared successfully", 
      cart: [] 
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ 
      message: "Error clearing cart", 
      error: error.message 
    });
  }
};

export { getCart, addToCart, removeFromCart, updateCartQuantity, clearCart };
