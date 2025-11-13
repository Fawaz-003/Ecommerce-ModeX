import UserProfile from "../models/userProfileModels.js";
import userModel from "../models/userModels.js";

const createProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    // Ensure only normal users (role 0) get a profile
    const user = await userModel.findById(userId).select("role name avatar");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.role !== 0) {
      return res.status(403).json({ success: false, message: "Profiles are only for role 0 users" });
    }

    const existingProfile = await UserProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(200).json({ success: true, profile: existingProfile });
    }

    const profileData = {
      user: userId,
      name: user.name,
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
    };
    const profile = await UserProfile.create(profileData);
    return res.status(201).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createEditProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, phone, gender, dob } = req.body;

    let profile = await UserProfile.findOne({ user: userId });

    if (profile) {
      profile.name = name || profile.name;
      profile.phone = phone || profile.phone;
      profile.gender = gender || profile.gender;
      profile.dob = dob || profile.dob;
      await profile.save();

      return res
        .status(200)
        .json({ success: true, message: "Profile updated", profile });
    }

    const user = await userModel.findById(userId).select("name avatar");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    profile = await UserProfile.create({
      user: userId,
      name: name || user.name,
      phone,
      gender,
      dob,
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || user.name)}&background=random`,
    });

    res
      .status(201)
      .json({ success: true, message: "Profile created", profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Validate userId format (MongoDB ObjectId)
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) {
      // Return empty wishlist instead of error for better UX
      return res.status(200).json({ 
        success: true, 
        profile: { 
          wishlist: [],
          cart: [],
          addresses: []
        } 
      });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createProfile, createEditProfile, getProfile };
