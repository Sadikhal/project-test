import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";
import { createError } from "../lib/createError.js";



export const createCategory =  async (req,res , next) => { 
  const newCategory = new Category({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newCategory.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

// get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean(); // Fetch categories

    // Fetch subcategories and attach them manually
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await SubCategory.find({ category: category._id });
        return { ...category, subCategory: subCategories }; // Add subCategory field
      })
    );

    res.status(200).json({ categories: categoriesWithSubcategories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};
// get single category

export const getCategory = async (req, res , next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) next(createError(404, "Category not found"));
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

export const updateCategory = async (req, res,next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body,
      },
      { new : true }
    );
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);

  };
};


export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send("category has been deleted!");
  } catch (err) {
    next(err);
};
};