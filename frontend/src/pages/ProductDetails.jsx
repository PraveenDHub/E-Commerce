import {
  Calendar,
  MessageSquare,
  Minus,
  PackageCheck,
  PackageX,
  Plus,
  ShoppingCart,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Ratings from "../components/Ratings";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  removeError,
} from "../features/products/productSlice";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { calculateDiscount, formatDate } from "../utils/formatter";

const ProductDetails = () => {
  const [userRating,setUserRating] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title={`${product?.name} | E-Commerce`} />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Product Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 rounded-2xl overflow-hidden">
          {/* Product Image here width is 50% by default because of grid-cols-2 */}
          {/* here we use aspect-square it takes the width of parent and makes the height equal to width */}
          <div className="rounded-lg aspect-square overflow-hidden">
            <img
              src={product?.images[0].url}
              alt="Product-img"
              title={product?.name}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>
          {/* Product Details */}
          <div className="flex flex-col">
            <h2 className="font-semibold text-gray-800 text-2xl mb-2">
              {product?.name}
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <Ratings value={product?.ratings} disabled={true} />
              <span className="text-sm font-medium text-gray-500">{product?.numOfReviews} Verified Reviews
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-semibold text-amber-500 text-4xl">
                ₹{product?.price}
              </span>
              <span className="text-gray-400 text-lg line-through">
                ₹{product?.mrp}
              </span>
              <span className="text-green-500 font-bold text-sm bg-green-100 px-2 py-1 rounded-md">
                {calculateDiscount(product?.price, product?.mrp)}% off
              </span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {product?.description}
            </p>
            <div className="space-y-6 border-t border-slate-300 pt-6">
              <div className="flex items-center gap-2">
                {product?.stock > 0 ? (
                  <>
                    <PackageCheck
                      size={20}
                      className="text-green-700 w-5 h-5"
                    />
                    <span className="text-sm font-medium text-green-700">
                      In Stock ({product?.stock} Available)
                    </span>
                  </>
                ) : (
                  <>
                    <PackageX size={20} className="text-red-700 w-5 h-5" />
                    <span className="text-sm font-medium text-red-700">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              {product?.stock > 0 && (
                <div className="flex flex-wrap items-center gap-5">
                  <div className="items-center border-2 border-slate-300 rounded-md flex">
                    <button className="p-4 text-sm hover:text-amber-500 transition-colors">
                      <Plus size={20} />
                    </button>
                    <span className="text-gray-600 p-4 font-bold w-15 text-center text-sm hover:text-amber-500 transition-colors">
                      1
                    </span>
                    <button className="p-4 text-sm hover:text-amber-500 transition-colors">
                      <Minus size={20} />
                    </button>
                  </div>
                  <button className="bg-blue-600 flex justify-center gap-2 items-center flex-1 text-white p-4 text-sm font-semibold rounded-md hover:bg-blue-700 transition-all duration-300 active:scale-95">
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
            {/* User Reviews*/}
            <form className="bg-slate-100 p-6 rounded-2xl border border-slate-100 mt-8">
              <h2 className="text-md font-semibold mb-4 tracking-tight text-slate-800 uppercase flex items-center gap-2"><MessageSquare size={18} className="text-amber-500"/>Share Your Feedback</h2>
              <div>
                <Ratings value={userRating} disabled={false} onRatingChange={(rating)=>setUserRating(rating)}/>
              </div>
              <textarea placeholder=" How was the product quality and delivery!" className="w-full p-4 border border-slate-300 rounded-2xl mt-4 focus:outline-none focus:border-amber-500 transition-colors min-h-24"></textarea>
              <button className="bg-slate-900 w-full mt-4 gap-2 items-center flex-1 text-white p-4 text-sm font-semibold rounded-2xl hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/50">Post review</button>
            </form>
          </div>
        </div>
        {/*Reviews Section*/}
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl border-l-4 border-amber-500 pl-4 rounded-sm font-bold text-gray-900">Customer Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product?.reviews?.map((review,index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-amber-200 transition-all duration-300 shadow-sm group">

                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full ring ring-gray-200 group-hover:ring-amber-500 transition-all duration-300 w-12 h-12 overflow-hidden">
                      <img src={review?.avatar} alt={review?.name} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{review?.name}</h2>
                      <div className="mt-1">
                        <Ratings value={review?.rating} disabled={true}/>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-slate-100 px-3 py-1 rounded-md border border-gray-100">
                    <Calendar size={16} className="text-gray-500"/>{formatDate(review?.createdAt)}
                  </div>
                </div>
                <p className="text-gray-600 text-lg font-medium italic leading-relaxed mb-6">"{review?.comment}"</p>
              </div>
            ))}
            {product?.reviews?.length === 0 && (
              <p className="text-center text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;