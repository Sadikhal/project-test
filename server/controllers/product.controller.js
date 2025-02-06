import { createError } from "../lib/createError.js";
import Product from "../models/product.model.js";
import SubCategory from "../models/subCategory.model.js";

export const createProduct = async (req, res, next) => {
    const newProduct = new Product({
      userId: req.userId,
      ...req.body,
    });
       
    try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (err) {
      next(err);
    }
  };
  
  export const deleteProduct = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) next(createError(404, "Product not found!"));

  
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("product has been deleted");
    } catch (err) {
      next(err);
    }
  };
  
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) next(createError(404, "Product not found!"));
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const { subCategory = [], search = "" } = req.query;

  let filters = {};

  if (subCategory.length) {
    filters.subCategory = { $in: subCategory.split(",") };
  }

  try {
    // Handle search filter
    if (search.length) {
      const regEx = new RegExp(search, "i");

      // Find matching subcategories based on the search
      const matchedSubCategories = await SubCategory.find({
        name: regEx,
      }).select("_id");

      const subCategoryIds = matchedSubCategories.map((sub) => sub._id);

      filters.$or = [
        { name: regEx }, // Search by product name
        { subCategory: { $in: subCategoryIds } }, // Search by matched subcategories
      ];
    }

    const products = await Product.find(filters)
      .populate("subCategory", "name") 
      // Populate subCategory to get its name
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error(error); // Debugging error
    res.status(500).json({ error: "Server Error" });
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(createError(404, "Product not found!"));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

