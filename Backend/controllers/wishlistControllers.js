import UserProfile from "../models/userProfileModels.js";
import Product from "../models/productModels.js";

const addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let user = await UserProfile.findOne({ user: userId });

    if (!user) {
      user = await UserProfile.create({
        user: userId,
        wishlist: [{ product: productId }],
      });

      return res.status(201).json({
        message: "Profile created and product added to wishlist",
        wishlist: user.wishlist,
      });
    }

    const alreadyExists = user.wishlist.some(
      (item) => item.product?.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push({ product: productId });
    await user.save();

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};


const removeFromWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    const user = await UserProfile.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const itemExists = user.wishlist.some(
      (item) => item.product?.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    user.wishlist = user.wishlist.filter(
      (item) => item.product?.toString() !== productId
    );

    await user.save();  

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};

export { addToWishlist, removeFromWishlist };
