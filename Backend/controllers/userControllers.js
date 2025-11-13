import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Function to generate avatar from user initials
const generateAvatarFromInitials = (name) => {
  if (!name) return `https://ui-avatars.com/api/?name=User&background=random`;
  
  const nameParts = name.trim().split(/\s+/);
  let initials = "";
  
  if (nameParts.length === 1) {
    // Single name: take first letter
    initials = nameParts[0].charAt(0).toUpperCase();
  } else {
    // Multiple names: take first letter of first and last name
    initials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  }
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=200&bold=true`;
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Generate avatar from initials if not already set (for email/password users)
    if (!user.avatar) {
      user.avatar = generateAvatarFromInitials(user.name);
      await user.save();
    }

    const token = createToken(user._id, user.role);
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, secretkey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists, try logging in",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let role = 0;
    if (secretkey && secretkey === process.env.ADMIN_SECRET_KEY) {
      role = 1;
    }

    // Generate avatar from initials for new email/password users
    const avatar = generateAvatarFromInitials(name);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      avatar,
    });

    const savedUser = await newUser.save();
    const token = createToken(savedUser._id, savedUser.role);

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        avatar: savedUser.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, role: 1 });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Generate avatar from initials if not already set
    if (!user.avatar) {
      user.avatar = generateAvatarFromInitials(user.name);
      await user.save();
    }

    const token = createToken(user._id, user.role);
    return res.status(200).json({
      success: true,
      message: "Admin Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const googleAuthCallback = (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  } catch (error) {
    console.error("Google login error:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate avatar from initials if not already set (for email/password users)
    if (!user.avatar) {
      user.avatar = generateAvatarFromInitials(user.name);
      await user.save();
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export { loginUser, registerUser, adminLogin, googleAuthCallback, getMe };
