import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { removeError, removeSuccess, resetPassword } from "../features/products/User/userSlice";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const {token} = useParams();
    const navigate = useNavigate();
    const {loading,error,success,message} = useSelector((state) => state.user);
    const handleResetPassword = (e) => {
        e.preventDefault();
        if(newPassword !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }
        const userData ={
            password : newPassword,
            confirmPassword
        }
        dispatch(resetPassword({token,data : userData}));
    }
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
        if (success) {
            toast.success(message);
            dispatch(removeSuccess());
            navigate("/login");
        }
    }, [error, success, message, dispatch]);
  return (
    <>
    <Navbar />
    <PageTitle title="Reset Password" />
    <div className="bg-slate-50 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-600 mt-2">Reset your password</p>
                </div>
                <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm text-gray-700 font-medium ml-1">New Password</label>
                    <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}  placeholder="••••••••" name="newPassword" id="newPassword" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm text-gray-700 font-medium ml-1">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}  placeholder="••••••••" name="confirmPassword" id="confirmPassword" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"/>
                </div>

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-all duration-300">{loading ? "Resetting..." : "Reset Password"}</button>
            </form>
        </div>
        </div>
    </>
  )
}

export default ResetPassword