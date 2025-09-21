import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images : {
    type: Array, 
    required: true,
  },
  category : {
    type: String,
    enum : ["Mobiles & Tablets", "Fashion", "Laptops", "Home & Furniture", "TVs & Appliances", "Headsets & Airpods"],
    required: true,
  },
  size : {
    type : Array,
    required : false,
  },
  brand : {
    type: String,
    required : false,
  },
  isfeatured : {
    type: Boolean,
    default : false, 
  },
  inStock : {
    type: Boolean,
    default : true,
  },
reviews : [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required : true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    }
  ],

}, {timestamps: true});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;