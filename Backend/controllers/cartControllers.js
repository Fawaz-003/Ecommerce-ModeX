
import UserProfile from "../models/userProfileModels.js";
import productModel from "../models/productModels.js";
import mongoose from "mongoose";

const getCart = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user._id }).populate({
      path: "cart.product",
      model: "product"
    });
    
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    
    res.status(200).json(userProfile.cart || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color, price } = req.body;
    
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
      // Update quantity if item exists
      userProfile.cart[existingItemIndex].quantity += quantity;
    } else {
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
    res.status(500).json({ 
      message: "Error clearing cart", 
      error: error.message 
    });
  }
};

export { getCart, addToCart, removeFromCart, updateCartQuantity, clearCart };
