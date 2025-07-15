import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // 🛒 Basic Product Details
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true, // Base price
      min: 0,
    },
    offerPrice: {
      type: Number,
      required: true, // ML predicted discounted price
      min: 0,
    },
    image: {
      type: [String],
      required: true,
    },

    // 🏷️ Category - can be company name or product type
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    // 🧮 Inventory + Dynamic Pricing Factors
    inStock: {
      type: Boolean,
      default: true,
      required: true,
    },
    inventory: {
      type: Number,
      required: true,
      min: 0,
    },
    daysToExpiry: {
      type: Number,
      required: true,
      min: 0,
    },
    demand: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true, // ⏱ Adds createdAt and updatedAt
  }
);

// Indexing for faster queries on category and stock
productSchema.index({ category: 1, inStock: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
