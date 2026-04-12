import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
} from "../controller/cartController.js";
import { verifyUser } from "../helper/userAuth.js";


const router = express.Router();

router.post("/cart", verifyUser, addToCart);
router.get("/cart", verifyUser, getCart);
router.put("/cart", verifyUser, updateCartItem);
router.delete("/cart/:productId", verifyUser, removeFromCart);
export default router;