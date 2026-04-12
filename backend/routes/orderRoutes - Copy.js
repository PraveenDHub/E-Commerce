import express from "express";
import { roleBasedAccess, verifyUser } from "../helper/userAuth.js";
import {
  createNewOrder,
  deleteOrderbyAdmin,
  getAllOrders,
  getAllOrdersbyAdmin,
  getOrderDetails,
  updateOrderStatusbyAdmin,
} from "../controller/orderController.js";

const router = express.Router();
//user
router.route("/new/order").post(verifyUser, createNewOrder);
router.route("/order/:id").get(verifyUser, getOrderDetails);
router.route("/orders/user").get(verifyUser, getAllOrders);

//admin routes
router
  .route("/admin/orders")
  .get(verifyUser, roleBasedAccess("admin"), getAllOrdersbyAdmin);
  
router
  .route("/admin/order/:id")
  .delete(verifyUser, roleBasedAccess("admin"), deleteOrderbyAdmin)
  .put(verifyUser, roleBasedAccess("admin"), updateOrderStatusbyAdmin);

export default router;
