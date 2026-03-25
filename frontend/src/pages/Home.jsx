import Footer from "../components/Footer";
import ImageSlider from "../components/ImageSlider";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, removeError } from "../features/products/productSlice.js";
import { useEffect } from "react";
import Loader from "../components/Loader.jsx";
import { toast } from "react-hot-toast";

const Home = () => {
  const dispatch = useDispatch();
  const {products,productCount,loading,error} = useSelector((state)=>state.product);
  useEffect(()=>{
    dispatch(getProducts());
  },[dispatch]);

  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(removeError());
    }
  },[error,dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Home | E-Commerce" />
          <Navbar />
          <ImageSlider />
          <div className="mt-12 p-8 font-bold">
            {/* Change Later */}
            <div className="text-center">
              <h2 className="text-4xl font-semibold mb-8 text-blue-700 border-b-2 border-blue-700 inline-block pb-2 drop-shadow-sm">
                Latest collections
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              }
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
