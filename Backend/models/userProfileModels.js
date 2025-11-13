import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String },
    avatar: { type: String },
    phone: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: { type: Date },
    addresses: [
      {
        name: { type: String },
        phone: { type: Number },
        label: { type: String, default: "Home" },
        doorNo: { type: String },
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: Number },
      },
    ],
    wishlist: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        size: { type: String },
        color: { type: String },
        price: { type: Number },
      },
    ],
    orders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        purchasedAt: { type: Date },
      },
    ],
    recentlyViewed: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    reviews: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productName: { type: String },
        productImage: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    returns: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        reason: { type: String },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected", "Refunded"],
          default: "Pending",
        },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    coupons: [
      {
        code: { type: String },
        discount: { type: Number },
        expiryDate: { type: Date },
        isUsed: { type: Boolean, default: false },
      },
    ],

    giftCards: [
      {
        cardNumber: { type: String },
        balance: { type: Number, default: 0 },
        expiryDate: { type: Date },
      },
    ],

    notifications: [
      {
        title: { type: String },
        message: { type: String },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
export default UserProfile;
