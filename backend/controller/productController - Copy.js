import APIHelper from "../helper/APIHelper.js";
import HandleError from "../helper/handleError.js";
import Product from "../model/productModel.js";
import { updateProductRatings } from "../helper/updateProductRatings.js";
// controllers/productController.js
export const addProducts = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { name, description, price, stock, category } = req.body;
    const file = req.file;

    if (!name || !description || !price || !stock || !category || !file) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // 🔥 Upload to Cloudinary using buffer
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            width: 500,
            crop: "scale",
            quality: "auto",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );

        stream.end(fileBuffer);
      });
    };

    const result = await streamUpload(file.buffer);

    const product = await Product.create({
      name,
      description,
      price: Number(price), // 🔥 fix type
      stock: Number(stock), // 🔥 fix type
      category,
      images: [
        {
          public_id: result.public_id,
          url: result.secure_url,
        },
      ],
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
      message: error.message,
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
      returnDocument: "after",
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

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔥 DELETE IMAGES FROM CLOUDINARY
    for (let img of product.images) {
      if(img.public_id){
        await cloudinary.v2.uploader.destroy(img.public_id);
      }
    }

    // 🔥 DELETE PRODUCT FROM DB
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product + images deleted successfully!",
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
          _id:          review._id,
          productId:    product._id.toString(),
          productName:  product.name,
          productImage: product.images?.[0]?.url || null,
          name:         review.name,
          rating:       review.rating,
          comment:      review.comment,
          createdAt:    review.createdAt,
        });
      });
    });
 
    // Sort newest first
    allReviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
 
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
 
    if (!productId || !reviewId) {
      return next(new HandleError("productId and reviewId are required", 400));
    }
 
    const product = await Product.findById(productId);
    if (!product) {
      return next(new HandleError("Product not found", 404));
    }
 
    // Remove the review
    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId
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
