import APIHelper from "../helper/APIHelper.js";
import HandleError from "../helper/handleError.js";
import Product from "../model/productModel.js";
import { updateProductRatings } from "../helper/updateProductRatings.js";
// controllers/productController.js
export const addProducts = async (req, res) => {
  try {
    const { name, description, price, stock, category, images } = req.body;

    // Validation
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!images || (Array.isArray(images) && images.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    // Convert single image to array (This is the key part)
    const imageArray = Array.isArray(images) ? images : [images];

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images: imageArray, // Always saved as array
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product" || error.message,
    });
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    //const products = await Product.find();
    const resPerPage = 4;
    const apiHelper = new APIHelper(Product.find(), req.query)
      .filter()
      .search();
    let page = Number(req.query.page) || 1;
    const filteredQuery = apiHelper.query.clone();
    const productCount = await filteredQuery.countDocuments();
    const totalPages = Math.ceil(productCount / resPerPage);

    if (page > 0 && page > totalPages) {
      return next(new HandleError("This Page doesn't exist!", 400));
    }
    const pageData = apiHelper.pagination(resPerPage);
    const products = await pageData.query;
    return res.status(200).json({
      message: "List of productCount Products",
      products,
      productCount,
      resPerPage,
      totalPages,
      currPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProducts = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new HandleError("Product not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name avatar",
    );
    return res.status(200).json({
      message: "Single Product",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  const existingReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString(),
  );

  if (existingReview) {
    existingReview.rating = Number(rating);
    existingReview.comment = comment;
  } else {
    product.reviews.push(review);
  }

  updateProductRatings(product);

  await product.save({ validateBeforeSave: false });

  // 🔥 populate AFTER save
  const updatedProduct = await Product.findById(productId).populate(
    "reviews.user",
    "name avatar",
  );

  res.status(200).json({
    success: true,
    message: existingReview
      ? "Review updated successfully"
      : "Review added successfully",
    product: updatedProduct,
  });
};

export const getProductReviews = async (req, res, next) => {
  const productId = req.query.id;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleError("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
};

export const getAllProductsAdmin = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
};

export const adminDeleteReview = async (req, res, next) => {
  const reviewId = req.query.id;
  const productId = req.query.productid;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleError("Product not found", 404));
  }
  //console.log(typeof reviewId);
  product.reviews = product.reviews.filter((review) => review.id !== reviewId);
  updateProductRatings(product);
  await product.save({ validateBeforeSave: false });
  res.json({
    success: true,
    message: "Deleted success in reviews",
  });
};
