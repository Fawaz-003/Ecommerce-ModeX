import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Carousel", carouselSchema);
