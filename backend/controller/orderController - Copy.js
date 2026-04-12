import HandleError from "../helper/handleError.js";
import Order from "../model/orderModel.js";
import mongoose from "mongoose";
import Product from "../model/productModel.js";

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
  if (order.orderStatus.toLowerCase() !== "delivered") {
    return next( new HandleError( " Order is under processing so cannot be cancelled!", 400));
  }
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
  if (order.orderStatus.toLowerCase() === "delivered" || order.orderStatus.toLowerCase() === "processing") {
    return next(new HandleError("Order is already been delivered! or Order is processing", 400));
  }

  // [Promise, Promise, Promise] => wait for all the promises to resolve before proceeding
  await Promise.all( order.orderItems.map((item) => updateQuantity(item.product, item.quantity)), ); // Update the product stock based on the order items
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
