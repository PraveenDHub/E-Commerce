import PageTitle from "../components/PageTitle";
import { useEffect, useState } from "react";
import {
  forgetPassword,
  removeError,
  removeSuccess,
} from "../features/products/User/userSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";


const ForgetPassword = () => {
  const { loading, error, success, message } = useSelector(
    (state) => state.user,
  );
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const handleForgetPassword = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email", { duration: 2000 });
      return;
    }
    dispatch(forgetPassword({ email }));
    setEmail("");
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
    if (success) {
      toast.success(message);
      dispatch(removeSuccess());
    }
  }, [error, success, message, dispatch]);
  return (
    <>
      <PageTitle title="Forget Password | E-Commerce" />
      <div className="bg-slate-50 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <form onSubmit={handleForgetPassword} className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                Forget Password
              </h2>
              <p className="text-gray-600 mt-2">Enter your email address</p>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 font-medium ml-1"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@gmail.com"
                name="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-all duration-300 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;