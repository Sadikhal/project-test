import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  }
});

export default mongoose.model("Category", categorySchema);
