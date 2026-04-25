import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../model/productModel.js";
import fs from "fs";
import path from "path";

// Load env vars
dotenv.config({ path: "backend/config/config.env" });

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB for seeding...");

    // Read JSON file from root
    const products = JSON.parse(
      fs.readFileSync(path.resolve("ecommerce.products.json"), "utf-8")
    );

    // Optional: Delete existing products
    await Product.deleteMany();
    console.log("Existing products deleted!");

    // Insert new products
    await Product.insertMany(products);
    console.log("All products added successfully!");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();
