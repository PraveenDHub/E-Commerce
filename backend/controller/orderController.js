import HandleError from "../helper/handleError.js";
import Order from "../model/orderModel.js";
import mongoose from "mongoose";
import Product from "../model/productModel.js";
import User from '../model/userModel.js';

export const createNewOrder = async (req, res) => {
  const {
    shippingAddress,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // ✅ 1. VALIDATE STOCK BEFORE ORDER CREATION
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `${product.name} is out of stock`,
      });
    }

    // optional: sync latest price
    item.price = product.price;
  }

  // ✅ 2. CREATE ORDER
  const order = await Order.create({
    shippingAddress,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  // ✅ 3. CLEAR USER CART
  const user = await User.findById(req.user.id);
  user.cartItems = [];
  await user.save();

  res.status(201).json({
    success: true,
    order,
  });
};

export const getOrderDetails = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email role",
  );

  if (!order) {
    return next(new HandleError("Order not found with this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
};

export const getAllOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders) {
    return next(new HandleError("No orders found for this user!", 404));
  }
  res.status(200).json({
    success: true,
    orders,
  });
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // ❌ Don't allow cancel if already delivered
  if (order.orderStatus === "Delivered") {
    return res.status(400).json({
      message: "Order already delivered, cannot cancel",
    });
  }

  // ❌ Don't cancel again
  if (order.orderStatus === "Cancelled") {
    return res.status(400).json({
      message: "Order already cancelled",
    });
  }

  order.orderStatus = "Cancelled";
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
  });
};

export const getAllOrdersbyAdmin = async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");
  if (!orders) {
    return next(new HandleError("No orders found!", 404));
  }
  const totalAmt = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  res.status(200).json({
    success: true,
    message: "All orders for admin",
    orders,
    totalAmt,
  });
};

export const deleteOrderbyAdmin = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new HandleError("Invalid order id!", 400));
  }
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new HandleError("Order not found with this id", 404));
  }
  const status = order.orderStatus.toLowerCase();

  if (status !== "delivered" && status !== "cancelled") {
    return next(
      new HandleError( "Only delivered or cancelled orders can be deleted!", 400 ) );
  }
  //order.orderStatus.toLowerCase()
  // order.orderStatus = "Cancelled";
  // await order.save();
  //await order.deleteOne(); // Remove the order from the database
  await Order.deleteOne({ _id: req.params.id }); // Remove the order from the database
  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
};

// Processing, Shipped , Delivered
export const updateOrderStatusbyAdmin = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new HandleError("Invalid order id!", 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("Order not found with this id", 404));
  }

  // Check if the order is already been delivered
  if (order.orderStatus.toLowerCase() === "delivered") {
    return next(
      new HandleError("Order already delivered, cannot update", 400)
    );
  }

  // [Promise, Promise, Promise] => wait for all the promises to resolve before proceeding
  if(req.body.status.toLowerCase() === "delivered"){
    await Promise.all( order.orderItems.map((item) => updateQuantity(item.product, item.quantity)), ); // Update the product stock based on the order items
  }
  order.orderStatus = req.body.status || order.orderStatus; // undefined || oldStatus
  if (order.orderStatus.toLowerCase() === "delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
};

async function updateQuantity(productId, quantity) {
  const product = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true },
  );
  if (!product) {
    throw new Error("Product not found!", 404);
  }
  await product.save({ validateBeforeSave: false });
}
