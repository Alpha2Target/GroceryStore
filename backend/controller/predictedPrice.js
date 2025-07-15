// utils/predictOfferPrice.js
import axios from "axios";

export const predictedPrice = async ({
  name,
  company,
  category,
  price,
  daysToExpiry,
  inventory,
  demand,
}) => {
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
      return data.predicted_price;
    } else {
      throw new Error("No predicted_price in response");
    }
  } catch (error) {
    console.error(`Prediction failed for "${name}":`, error.message);
    return null;
  }
};
