import Category from "../models/categoryModels.js";

const addCategory = async (req, res) => {
  try {
    const { name, subcategory } = req.body;

    if (!name || !subcategory) {
      return res
        .status(400)
        .json({ message: "Name and subcategory are required" });
    }

    const existCategory = await Category.findOne({ name });
    if (existCategory) {
      return res.status(400).json({
        success: false,
        message: "Category Already Exist, Try Adding SubCategory",
      });
    }

    const newCategory = new Category({ name, subcategory });
    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subcategory } = req.body;

    const fetchedCategory = await Category.findById(id);
    if (!fetchedCategory) {
        return res.status(404).json({message: "Category Not Found"})
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, subcategory },
      { new: true, runValidators: true }
    );
 
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const listCategory = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const singleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const fetchCategory = await Category.findById(id);

    if (!fetchCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      Category: fetchCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  addCategory,
  editCategory,
  deleteCategory,
  listCategory,
  singleCategory,
};
 