import express from "express";
import {
  getAllProducts,
  addProducts,
  getSingleProduct,
  updateProducts,
  deleteProducts,
  createProductReview,
  getProductReviews,
  getAllProductsAdmin,
  adminDeleteReview,
} from "../controller/productController.js";
import { roleBasedAccess, verifyUser } from "../helper/userAuth.js";

const router = express.Router();

//User side
router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.route("/review").put(verifyUser, createProductReview);

//Admin
router.post( "/admin/product/create", verifyUser, roleBasedAccess("admin", "stockmanager"), addProducts);

router
  .route("admin/product/:id")
  .put(verifyUser, roleBasedAccess("admin"), updateProducts)
  .delete(verifyUser, roleBasedAccess("admin"), deleteProducts);

//Admin view all products
router
  .route("/admin/products")
  .get(verifyUser, roleBasedAccess("admin"), getAllProductsAdmin);

//View review
router
  .route("/admin/reviews")
  .get(verifyUser, roleBasedAccess("admin"), getProductReviews)
  .delete(verifyUser, roleBasedAccess("admin"), adminDeleteReview);
//Delete review

export default router;
