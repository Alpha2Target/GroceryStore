// cronJobs/dailyUpdater.js
import cron from "node-cron";
import Product from "../models/product.model.js";
import axios from "axios";

export const scheduleDailyUpdates = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("⏰ Running daily product update task...");

      const products = await Product.find({});
      const now = new Date();

      for (const product of products) {
        // ✅ Validate and update daysToExpiry
        if (
          product.daysToExpiry === undefined ||
          product.daysToExpiry === null ||
          isNaN(product.daysToExpiry)
        ) {
          console.warn(`⚠️ Skipping "${product.name}" due to invalid daysToExpiry`);
          continue;
        }

        const newDaysToExpiry = Math.max(0, product.daysToExpiry - 1);

        // ✅ Update the daysToExpiry field in DB
        product.daysToExpiry = newDaysToExpiry;

        // ✅ Construct payload
        const payload = {
          product_name: product.name,
          company_name: product.company,
          product_type: product.category,
          base_price: parseFloat(product.price),
          days_to_expiry: newDaysToExpiry,
          inventory: parseInt(product.inventory),
          demand: parseInt(product.demand),
        };

        // console.log(`📦 Predicting new price for: ${product.name}`);
        // console.log("🔍 Payload for prediction:", payload);

        // 🔮 Predict new price using Python FastAPI
        try {
          const response = await axios.post("http://127.0.0.1:8000/predict", payload);
          const predictedPrice = response.data.predicted_price;

          if (predictedPrice !== undefined) {
            product.offerPrice = predictedPrice;
            await product.save();
            // console.log(`✅ Updated: ${product.name}, New Price: ₹${predictedPrice}`);
          } else {
            console.warn(`⚠️ Skipping save — no predicted price for "${product.name}"`);
          }
        } catch (predictErr) {
          console.error(`❌ Prediction failed for "${product.name}":`, predictErr.response?.data || predictErr.message);
        }
      }

      console.log("✅ Daily pricing update complete");
    } catch (error) {
      console.error("❌ Error in daily updater:", error.message);
    }
  });
};
