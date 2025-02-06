import SubCategory from "../models/subCategory.model.js";
import Category from "../models/category.model.js";
import { createError } from "../lib/createError.js";



export const createSubCategory = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    // Check if the subcategory with the same name already exists in the given category
    const existingSubcategory = await SubCategory.findOne({ name, category: categoryId, });

    if (existingSubcategory) {
      return res.status(400).json({ error: "Subcategory with this name already exists in the selected category" });
    }

    // Create a new subcategory if it doesn't exist in the same category
    const subcategory = new SubCategory({ name, category: categoryId ,
      userId: req.userId
    });
    await subcategory.save();

    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get all categories
export const getSubCategories = async (req, res, next) => {
  try {
    const subcategories = await SubCategory.find().populate("category", "name");
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  }


//category wise
export const getSubCategory = async (req, res , next) => {
  try {
    const subcategories = await SubCategory.find({ category: req.params.categoryId });
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSingleSubCategory = async (req, res , next) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!category) next(createError(404, "Category not found"));
    res.status(200).json(subCategory);
  } catch (error) {
    next(error);
  }
}



export const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await SubCategory.findByIdAndDelete(id);
    res.status(200).send("category has been deleted!");
  } catch (err) {
    next(err);
};
};