import express from "express";
import {
  getAllProducts,
  addProducts,
  getSingleProduct,
  updateProducts,
  deleteProducts,
  createProductReview,
  getAllReviews,
  getAllProductsAdmin,
  getAdminDashboard,
  adminDeleteReview,
} from "../controller/productController.js";
import { roleBasedAccess, verifyUser } from "../helper/userAuth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

//User side
router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.route("/review").put(verifyUser, createProductReview);

//Admin create
router.post(
  "/admin/product/create",
  verifyUser,
  roleBasedAccess("admin", "stockmanager"),
  upload.array("images", 6), // max 6 images (you can change)
  addProducts,
);

//admin dashboard
router.get(
  "/admin/dashboard",
  verifyUser,
  roleBasedAccess("admin"),
  getAdminDashboard,
);

//admin update delete product
router
  .route("/admin/product/:id")
  .put(
    verifyUser,
    roleBasedAccess("admin"),
    upload.array("images", 6),
    updateProducts,
  )
  .delete(verifyUser, roleBasedAccess("admin"), deleteProducts);

//Admin view all products
router
  .route("/admin/products")
  .get(verifyUser, roleBasedAccess("admin"), getAllProductsAdmin);

//View review
router
  .route("/admin/reviews")
  .get(verifyUser, roleBasedAccess("admin"), getAllReviews);

//Admin Delete review
router
  .route("/admin/review")
  .delete(verifyUser, roleBasedAccess("admin"), adminDeleteReview);

export default router;
