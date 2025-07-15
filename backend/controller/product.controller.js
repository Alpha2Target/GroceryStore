import Product from "../models/product.model.js";
import axios from "axios";

// ✅ Add new product: POST /api/product/add-product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      company,
      inventory,
      daysToExpiry,
      demand,
    } = req.body;

    const images = req.files?.map((file) => file.filename);

    // Validate fields
    if (
      !name ||
      !price ||
      !description ||
      !category ||
      !company ||
      inventory === undefined ||
      daysToExpiry === undefined ||
      demand === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images, inventory, expiry, demand, and company are required",
      });
    }

    // 🔮 Predict offer price by calling Python API
    let offerPrice = price; // Default fallback to base price
    try {
      const { data } = await axios.post("http://127.0.0.1:8000/predict", {
        product_name: name,
        company_name: company,
        product_type: category,
        base_price: parseFloat(price),
        days_to_expiry: parseInt(daysToExpiry),
        inventory: parseInt(inventory),
        demand: parseInt(demand),
      });

      if (data && data.predicted_price) {
        offerPrice = data.predicted_price;
      }
    } catch (error) {
      console.error("Prediction API error:", error.message);
    }

    // 💾 Save product to DB
    const product = new Product({
      name,
      price,
      offerPrice,
      description: description.split(",").map((d) => d.trim()),
      category,
      company,
      image: images,
      inventory,
      daysToExpiry,
      demand,
      inStock: true,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};


// ✅ Get all products: GET /api/product/list
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Get product by ID: GET /api/product/id/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Toggle inStock status: POST /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    if (!id || typeof inStock !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Product ID and stock status (true/false) are required",
      });
    }

    const product = await Product.findByIdAndUpdate(id, { inStock }, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
      message: "Stock updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
