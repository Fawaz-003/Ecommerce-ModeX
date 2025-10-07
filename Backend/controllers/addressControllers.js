import UserProfile from "../models/userProfileModels.js";
import User from "../models/userModels.js";

const addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, label, doorNo, street, city, state, country, postalCode } =
      req.body;
    const newAddress = {
      name,
      phone,
      label,
      doorNo,
      street,
      city,
      state,
      country,
      postalCode,
    };

    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) {
      profile = await UserProfile.create({
        user: userId,
        addresses: [newAddress],
      });
    }

    profile.addresses.push(newAddress);
    await profile.save();

    res
      .status(201)
      .json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    profile.addresses = profile.addresses.filter(
      (address) => address.id !== addressId
    );
    await profile.save();

    res.status(200).json({ message: "Address removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const { name, phone, label, doorNo, street, city, state, country, postalCode } =
      req.body;

    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const addressIndex = profile.addresses.findIndex(
      (address) => address.id === addressId
    );
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    profile.addresses[addressIndex] = {
      ...profile.addresses[addressIndex],
      name,
      phone,
      label,
      doorNo,
      street,
      city,
      state,
      country,
      postalCode,
    };
    await profile.save();

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { addAddress, removeAddress, editAddress };
