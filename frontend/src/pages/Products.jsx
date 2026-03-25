import toast from "react-hot-toast";
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import PageTitle from "../components/PageTitle"
import { getProducts, removeError } from "../features/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";

const Products = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {products,productCount,loading,error,resPerPage} = useSelector((state)=>state.product);
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const category = searchParams.get("category") || "";
    const pageFronURL = parseInt(searchParams.get("page"),10) || 1;
    const totalPages = Math.ceil(productCount / (resPerPage || 5));
    useEffect(()=>{
      dispatch(getProducts({keyword,category,page:pageFronURL}));
    },[dispatch,keyword,category,pageFronURL]);
  
    useEffect(()=>{
      if(error){
        toast.error(error);
        dispatch(removeError());
      }
    },[error,dispatch]);

    const handleCategoryClick = (cat) => {
      const params = new URLSearchParams(searchParams);
      if(cat === "All"){
        params.delete("category");
      }else{
        params.set("category", cat);
      }
      params.delete("page");
      navigate(`?${params.toString()}`);
    };

  return (
    <>
    {loading ? (
      <Loader />
    ) : (
      <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <PageTitle title={"Products | E commerce"}/>
          <Navbar/>
          {/*container is a keyword for tailwind */}
          <main className="container mx-auto grow px-4 py-8">
              <div className="flex flex-col gap-8 md:flex-row">
                  <aside className="w-full md:w-1/4">
                      <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                        <h2 className="text-xl font-semibold border-b border-slate-200 mb-4 pb-4">Categories</h2>
                        <ul className="space-y-2">
                          {["All", "Electronics", "Fashion", "Footwear", "Home & Kitchen", "Sports & Fitness" ].map((cat)=>(
                            <li key={cat} onClick={()=>handleCategoryClick(cat) }>
                              <button className="text-left w-full hover:bg-slate-100 px-2 py-1 rounded">{cat}</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                  </aside>
                  <section className="w-full md:3/4 bg-white p-8 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-semibold">Our Products</h3>
                          <span className="text-sm text-gray-500">{products.length || 0} Items Found</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {products && products.map((product)=> <ProductCard key={product._id} product={product}/>)}
                        </div>
                        {/*Product Not found*/}
                          {products.length === 0 && (
                            <div className="flex justify-center items-center text-lg py-10 text-gray-400">No Product Found</div>
                          )}
                  </section>
              </div>
              {/*Pagination*/}
              <div className="flex justify-center mt-12">
                {productCount > 1 && (
                <Pagination totalPages={totalPages} products={products}/>
              )}
              </div>
          </main>
          <Footer/>
        </div>
      </>
    )}
    </>
  )
}

export default Products