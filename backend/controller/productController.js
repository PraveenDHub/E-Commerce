import APIHelper from '../helper/APIHelper.js';
import HandleError from '../helper/handleError.js';
import Product from '../model/productModel.js';
import { updateProductRatings } from '../helper/updateProductRatings.js';
import mongoose from 'mongoose';
//create products
export const addProducts = async (req, res) => {
    const { name, description, price, stock, category, images } = req.body;
    req.body.user = req.user.id;
    if (!name || !description || !price || !stock || !category || !images) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields",
        });
    }

    const product = await Product.create({
        ...req.body,
    });
    
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
}

export const getAllProducts = async (req, res,next) => {
  try {
        const resPerPage = 6;
        const apiHelper = new APIHelper(Product.find(),req.query).filter().search();
        let page = parseInt(req.query.page, 10);

        if (isNaN(page) || page < 1) {
            page = 1;
        }

        const filteredQuery = apiHelper.query.clone();
        const productCount = await filteredQuery.countDocuments();
        const totalPages = Math.ceil(productCount / resPerPage);

        if(!productCount){
            return next(new HandleError("No products found", 404));
        }

        if(page > 0 && page > totalPages){
            return next(new HandleError("This Page doesn't exist!", 400));
        }
        const pageData = apiHelper.pagination(resPerPage);
        const products = await pageData.query;

        return res.status(200).json({
            success:true,
            message:"List of Products",
            products,
            productCount,
            resPerPage,
            totalPages,
            currPage : page,
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        });
    }
}

export const updateProducts = async (req, res,next) => {
        try {
            const id = req.params.id;
            const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

            if(!product){
                return next(new HandleError("Product not found", 404));
            }

            return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
            });

        } 
        catch (error) {
            return res.status(500).json({
            message: error.message,
            });
        }
};

export const deleteProducts = async (req, res) => {
    try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if(!product){
        return res.status(404).json({success: false,message: "Product not found"});
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });

  } 
  catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res,next) => {
  try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new HandleError("Invalid product ID", 400));
        }
        const id = req.params.id;
        let product = await Product.findById(id);

        if(!product){
            return next(new HandleError("Product not found", 404));
        }

        return res.status(200).json({
            message:"Single Product",
            product,
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        });
    }
}

export const createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review ={
        user : req.user._id,// id
        avatar : req.user.avatar.url,
        name : req.user.name,
        rating : Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    if(!product){
        return next(new HandleError("Product not found", 404));
    }
    let isReviewed = product.reviews.find((rev) => rev.user.equals(req.user._id));
    if(isReviewed){
        //update review req.user.id
        //4️⃣ Important subtle detail (Objects inside arrays)
        // Even though filter() creates a new array, the objects inside are still references. So, when we find the review object using find(), we get a reference to that object. When we update the properties of that object, it updates the original review in the product.reviews array because they are the same object in memory.

        //5️⃣ Why we don't need to use findByIdAndUpdate() here?
        // Since we are modifying the review object directly and then calling product.save(), Mongoose will detect the changes and update the document accordingly. We don't need to use findByIdAndUpdate() because we are working with the document instance (product) that we retrieved from the database, and any changes made to it will be saved when we call save().
        isReviewed.rating = Number(rating);
        isReviewed.comment = comment;
        updateProductRatings(product);

        await product.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
        });
    }else{
        //create review
        product.reviews.push(review);
        updateProductRatings(product);

        await product.save({validateBeforeSave : false});
        res.status(200).json({
            success: true,
            message: "Review added successfully",
        });
    }
};

export const getProductReviews = async (req, res, next) => {
    const productId = req.query.id;
    const product = await Product.findById(productId);
    if(!product){
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
    if(!product){
        return next(new HandleError("Product not found", 404));
    }
    //console.log(typeof reviewId);
    product.reviews = product.reviews.filter((review)=> review.id !== reviewId);
    updateProductRatings(product);
    await product.save({validateBeforeSave:false});
    res.json({
        success:true,
        message:"Deleted success in reviews"
    });
};