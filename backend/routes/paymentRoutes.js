import express from "express";
import { processPayment,verifyPayment,sendStripeApiKey } from "../controller/paymentController.js";
import { verifyUser } from "../helper/userAuth.js";

const router = express.Router();

router.post("/payment/process", verifyUser,processPayment);
router.post("/payment/verify", verifyUser,verifyPayment);
router.get("/payment/stripeapikey", sendStripeApiKey);

export default router;