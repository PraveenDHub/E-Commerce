import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  removeSuccess,
  removeError,
  updateProfile,
} from "../features/products/User/userSlice.js";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const dispatch = useDispatch();

  const { error, success, user, isAuthenticated, loading } = useSelector(
    (state) => state.user,
  );

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // ✅ NEW (for multer)
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [isChanged, setIsChanged] = useState(false);
  const fileInputRef = useRef(null);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
      });
      setAvatarPreview(user.avatar?.url || "");
    }
  }, [user]);

  // Detect changes
  useEffect(() => {
    if (!user) return;

    const nameChanged = profile.name.trim() !== (user.name || "").trim();
    const emailChanged = profile.email.trim() !== (user.email || "").trim();
    const avatarChanged = avatarFile !== null;

    setIsChanged(nameChanged || emailChanged || avatarChanged);
  }, [profile, avatarFile, user]);

  // Toast handling
  useEffect(() => {
    if (success) {
      dispatch(removeSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [success, error, dispatch]);

  // Avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // ✅ actual file
      setAvatarPreview(URL.createObjectURL(file)); // ✅ preview
    }
  };

  // Submit
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!isChanged) {
      toast.error("No changes detected. Please update something.");
      return;
    }

    const formData = new FormData();
    formData.set("name", profile.name);
    formData.set("email", profile.email);

    if (avatarFile) {
      formData.set("avatar", avatarFile); // ✅ file for multer
    }

    dispatch(updateProfile(formData));
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <PageTitle title="Update Profile | E-Commerce" />

      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200 p-8 pt-12">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-8">
            Update Profile
          </h1>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden ring-4 ring-slate-100">
                {/* ✅ changed ONLY this line */}
                <img
                  src={avatarPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white border-2 border-white shadow-md hover:bg-indigo-700 transition-colors"
              >
                <Camera size={20} />
              </button>
            </div>

            {/* Name */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full bg-transparent border-none focus:outline-none text-lg font-semibold text-slate-700 px-1"
              />
            </div>

            {/* Email */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full bg-transparent border-none focus:outline-none text-lg font-semibold text-slate-700 px-1"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isChanged || loading}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  isChanged && !loading
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
