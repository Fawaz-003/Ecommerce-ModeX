import UserProfile from "../models/userProfileModels.js";

export const addRecentView = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID required" });
    }

    let profile = await UserProfile.findOne({ user: userId });

    // If no profile found, create one for the user
    if (!profile) {
      profile = new UserProfile({ user: userId });
    }

    // Remove the product if it already exists (to move it to the top)
    profile.recentlyViewed = profile.recentlyViewed.filter(
      (item) => item.product.toString() !== productId
    );

    // Add the product at the start (like a recent stack)
    profile.recentlyViewed.unshift({
      product: productId,
      viewedAt: new Date(),
    });

    // Limit to last 20 viewed items
    profile.recentlyViewed = profile.recentlyViewed.slice(0, 20);

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Product added to recently viewed",
    });
  } catch (error) {
    console.error("Error in addRecentView:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding recent view",
      error: error.message,
    });
  }
};

export const getRecentViews = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserProfile.findOne({ user: userId })
      .populate("recentlyViewed.product", "name price imageUrl category")
      .select("recentlyViewed");

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const sortedViews = profile.recentlyViewed.sort(
      (a, b) => b.viewedAt - a.viewedAt
    );

    res.status(200).json(sortedViews);
  } catch (error) {
    console.error("Error in getRecentViews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearRecentViews = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserProfile.findOne({ user: userId });
    if (!profile)
      return res.status(404).json({ message: "User profile not found" });

    profile.recentlyViewed = [];
    await profile.save();

    res.status(200).json({ message: "Recently viewed products cleared" });
  } catch (error) {
    console.error("Error in clearRecentViews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
