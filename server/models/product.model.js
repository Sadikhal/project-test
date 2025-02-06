import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  ram: { type: Number, required: true, enum: [4, 8,] },  
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    variants: [variantSchema],
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true }, 
    code: { type: String },
    partNumber: { type: String },
    desc: { type: String, required: true },
    image: { 
      type: [String], 
      required: true, }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
