import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle"
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { login, removeError, removeSuccess } from "../features/products/User/userSlice.js";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getCart } from "../features/products/Cart/cartSlice.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {error,message,success,user,isAuthenticated} = useSelector((state)=>state.user);
    const dispatch = useDispatch();

    //redirect if user is already logged in
    const location = useLocation();
    const redirect = new URLSearchParams(location.search).get("redirect"); // shipping

    useEffect(() => {
        if(isAuthenticated){
            navigate(redirect ? `/${redirect}` : "/", { replace: true });
        }
    }, [isAuthenticated,navigate,redirect]);
    
    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login({email,password}));
    }

    //useEffect runs only when component mount and when error,success,message,dispatch changes
  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch(removeError());
    }
    if(success && user){
      toast.success(message);
      dispatch(removeSuccess());
      dispatch(getCart());
      // Navigation is handled by the isAuthenticated useEffect above,
      // which respects the ?redirect= query param (e.g., /shipping)
    }
  }, [error,success,message,dispatch]);
  return (
    <>
        <PageTitle title="Login | E-Commerce" />
        <div className="bg-slate-50 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Login to your account</p>
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm text-gray-700 font-medium ml-1">Email</label>
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}  placeholder="example@gmail.com" name="email" id="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm text-gray-700 font-medium ml-1">Password</label>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}  placeholder="......." name="password" id="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"/>
                    <Link to="/password/forget" className="text-blue-600 text-xs font-semibold my-2 hover:underline">Forget Password</Link>
                </div>

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-all duration-300">Sign In</button>
                <p className="text-gray-600 mt-4 text-center">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign Up</Link>
                </p>
            </form>
        </div>
        </div>
    </>
  )
}

export default Login