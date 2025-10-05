import UserProfile from "../models/userProfileModels.js";

const createEditProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { phone, gender, dob } = req.body;

    let profile = await UserProfile.findOne({ user: userId });

    if (profile) {
      profile.phone = phone || profile.phone;
      profile.gender = gender || profile.gender;
      profile.dob = dob || profile.dob;
      await profile.save();

      return res
        .status(200)
        .json({ success: true, message: "Profile updated", profile });
    }

    profile = await UserProfile.create({
      user: userId,
      phone,
      gender,
      dob,
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
    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Create your Profile" });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createEditProfile, getProfile };
