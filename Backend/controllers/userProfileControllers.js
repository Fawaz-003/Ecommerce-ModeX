import UserProfile from "../models/userProfileModel.js";
import User from "../models/userModel.js";

// ---------------------------
// Create or Update Profile
// ---------------------------
export const upsertUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from middleware (JWT verified user)
    const { phone, gender, dob, address } = req.body;

    let profile = await UserProfile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile.phone = phone || profile.phone;
      profile.gender = gender || profile.gender;
      profile.dob = dob || profile.dob;
      profile.address = address || profile.address;
      await profile.save();

      return res.status(200).json({ success: true, message: "Profile updated", profile });
    }

    // Create new profile
    profile = await UserProfile.create({
      user: userId,
      phone,
      gender,
      dob,
      address,
    });

    res.status(201).json({ success: true, message: "Profile created", profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------
// Get Logged-in User Profile
// ---------------------------
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserProfile.findOne({ user: userId })
      .populate("user", "name email")
      .populate("orders")
      .populate("wishlist")
      .populate("reviews.product", "name price");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------
// Add to Wishlist
// ---------------------------
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    if (!profile.wishlist.includes(productId)) {
      profile.wishlist.push(productId);
      await profile.save();
    }

    res.status(200).json({ success: true, message: "Product added to wishlist", wishlist: profile.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------
// Remove from Wishlist
// ---------------------------
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    profile.wishlist = profile.wishlist.filter(item => item.toString() !== productId);
    await profile.save();

    res.status(200).json({ success: true, message: "Removed from wishlist", wishlist: profile.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------
// Get Notifications
// ---------------------------
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    res.status(200).json({ success: true, notifications: profile.notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
