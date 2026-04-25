import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../model/productModel.js";
import fs from "fs";
import path from "path";

// Load env vars
dotenv.config({ path: "backend/config/config.env" });

// Helper to clean up MongoDB Extended JSON ($oid, $date, etc)
const cleanData = (data) => {
  if (Array.isArray(data)) {
    return data.map(cleanData);
  } else if (data !== null && typeof data === "object") {
    if (data.$oid) return data.$oid;
    if (data.$date) return new Date(data.$date);
    
    const newObj = {};
    for (const key in data) {
      newObj[key] = cleanData(data[key]);
    }
    return newObj;
  }
  return data;
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB for seeding...");

    // Read JSON file from root
    let products = JSON.parse(
      fs.readFileSync(path.resolve("ecommerce.products.json"), "utf-8")
    );

    // Clean the data to remove $oid and $date wrappers
    products = cleanData(products);

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
