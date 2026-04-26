import APIHelper from "../helper/APIHelper.js";
import HandleError from "../helper/handleError.js";
import Product from "../model/productModel.js";
import { updateProductRatings } from "../helper/updateProductRatings.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import cloudinary from "../utils/cloudinary.js";

// controllers/productController.js
export const addProducts = async (req, res) => {
  try {
    const { name, description, price, mrp, stock, category } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !mrp ||
      stock === undefined ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const numPrice = Number(price);
    const numMrp = Number(mrp);
    const numStock = Number(stock);

    if (isNaN(numPrice) || isNaN(numMrp) || isNaN(numStock)) {
      return res.status(400).json({
        success: false,
        message: "Invalid numeric values",
      });
    }

    if (numMrp <= numPrice) {
      return res.status(400).json({
        success: false,
        message: "MRP must be greater than Price",
      });
    }

    // 🔥 Parallel upload
    const images = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, "products");

        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }),
    );

    const product = await Product.create({
      name,
      description,
      price: numPrice,
      mrp: numMrp,
      stock: numStock,
      category: category.trim(),
      images,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      product,
      message: "Product created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    //const products = await Product.find();
    const resPerPage = 12;
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

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ BASIC FIELDS UPDATE
    const { name, description, price, mrp, stock, category } = req.body;

    product.name = name;
    product.description = description;
    product.price = price;
    product.mrp = mrp;
    product.stock = stock;
    product.category = category;

    // ✅ HANDLE EXISTING IMAGES
    let existingImages = [];

    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (err) {
        existingImages = [];
      }
    }

    // ✅ DELETE REMOVED IMAGES FROM CLOUDINARY (ONLY IF public_id EXISTS)
    const removedImages = product.images.filter(
      (img) => img.public_id && !existingImages.find((i) => i.url === img.url),
    );

    for (const img of removedImages) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // ✅ UPLOAD NEW IMAGES
    let newImages = [];

    if (req.files && req.files.length > 0) {
      newImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer, "products");
          return {
            public_id: result.public_id,
            url: result.secure_url,
          };
        }),
      );
    }

    // ✅ FINAL IMAGES MERGE (IMPORTANT FIX)
    product.images = [
      ...existingImages.map((img) => ({
        ...(img.public_id && { public_id: img.public_id }),
        url: img.url,
      })),
      ...newImages,
    ];

    product.user = product.user || req.user._id;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔥 DELETE IMAGES FROM CLOUDINARY (MULTIPLE SUPPORT)
    await Promise.all(
      product.images
        .filter((img) => img.public_id)
        .map((img) => cloudinary.uploader.destroy(img.public_id)),
    );

    // 🔥 DELETE PRODUCT FROM DB
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product + images deleted successfully!",
      id,
    });
  } catch (error) {
    res.status(500).json({
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
  try {
    console.log("USER AVATAR:", req.user.avatar);
    const { rating, comment, productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new HandleError("Product not found", 404));
    }

    // 🔥 Build snapshot review
    const reviewData = {
      user: req.user._id,
      name: req.user.name,
      avatar: {
        public_id: req.user?.avatar?.public_id || null,
        url: req.user?.avatar?.url,
      },
      rating: Number(rating),
      comment,
    };

    // 🔍 Check if user already reviewed
    const existingReview = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      // ✏️ Update existing review
      existingReview.rating = Number(rating);
      existingReview.comment = comment;

      // (optional) update snapshot again if you want latest info
      existingReview.name = req.user?.name;
      existingReview.avatar = reviewData?.avatar;
    } else {
      // ➕ Add new review
      product.reviews.push(reviewData);
    }

    // ⭐ Update ratings
    updateProductRatings(product);

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: existingReview
        ? "Review updated successfully"
        : "Review added successfully",
      product,
    });
  } catch (error) {
    return next(new HandleError(error.message, 500));
  }
};

export const getAllProductsAdmin = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
};

//getting dashboard page
export const getAdminDashboard = async (req, res) => {
  try {
    const orders = await Order.find();
    const products = await Product.find();
    const users = await User.find();

    // 💰 Total Revenue
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

    // 📦 Stock counts
    const inStock = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;

    // ⭐ Total reviews
    const totalReviews = products.reduce((acc, p) => acc + p.numOfReviews, 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        inStock,
        outOfStock,
        totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET all reviews across every product (admin) ────────────
// GET /api/v1/admin/reviews
export const getAllReviews = async (req, res, next) => {
  try {
    // Fetch all products and pick only the fields we need
    const products = await Product.find({}, "name images reviews");

    // Flatten: attach productName + productImage to each review
    const allReviews = [];

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        allReviews.push({
          _id: review._id,
          productId: product._id.toString(),
          productName: product.name,
          productImage: product.images?.[0]?.url || null,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        });
      });
    });

    // Sort newest first
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      reviews: allReviews,
    });
  } catch (error) {
    return next(new HandleError(error.message, 500));
  }
};

// ── DELETE a single review by productId + reviewId (admin) ──
// DELETE /api/v1/admin/review?productId=...&reviewId=...
export const adminDeleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.query;
    console.log(productId, reviewId);

    if (!productId || !reviewId) {
      return next(new HandleError("productId and reviewId are required", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new HandleError("Product not found", 404));
    }

    // Remove the review
    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId,
    );

    // Recalculate ratings
    updateProductRatings(product);

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return next(new HandleError(error.message, 500));
  }
};
