import Carousel from "../models/carouselModels.js";
import { v2 as cloudinary } from "cloudinary";

// CREATE SLIDE
const createSlide = async (req, res) => {
  try {
    const { title, description, link, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Wrap the upload stream in a Promise to handle it asynchronously
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: "Ecommerce_ModeX/carousel"
      }, (error, result) => {
        if (error) {
          return reject(new Error("Cloudinary upload failed: " + error.message));
        }
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Cloudinary upload failed: No result returned."));
          }
      });
      uploadStream.end(req.file.buffer);
    });

    const uploadResult = await uploadPromise;

    // Save slide in DB after successful upload
    const slide = await Carousel.create({
      title,
      description,
      link,
      order,
      image: uploadResult.secure_url,
    });

    return res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL SLIDES
const getSlides = async (req, res) => {
  try {
    const slides = await Carousel.find().sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE SLIDE
const deleteSlide = async (req, res) => {
  try {
    const slide = await Carousel.findById(req.params.id);
    if (!slide)
      return res.status(404).json({ message: "Slide not found" });

    // Extract Cloudinary public_id
    const publicId = slide.image.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(`Ecommerce_ModeX/carousel/${publicId}`);

    await Carousel.findByIdAndDelete(req.params.id);

    res.json({ message: "Slide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SLIDE
const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, order } = req.body;

    let slide = await Carousel.findById(id);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    // If a new image is provided, upload it and delete the old one
    if (req.file) {
      // Extract Cloudinary public_id of the old image
      const publicId = slide.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`Ecommerce_ModeX/carousel/${publicId}`);

      // Wrap the upload stream in a Promise
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
          folder: "Ecommerce_ModeX/carousel"
        }, (error, result) => {
          if (error) {
            return reject(new Error("Cloudinary upload failed: " + error.message));
          }
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Cloudinary upload failed: No result returned."));
          }
        });
        uploadStream.end(req.file.buffer);
      });

      slide.image = uploadResult.secure_url;
    }

    // Update other fields regardless of whether a new image was uploaded
    slide.title = title || slide.title;
    slide.description = description || slide.description;
    slide.link = link || slide.link;
    slide.order = order !== undefined ? order : slide.order;
    await slide.save();
    return res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createSlide, getSlides, deleteSlide, updateSlide };
