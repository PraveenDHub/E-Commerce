import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";

const Profile = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <PageTitle title="Profile | E-Commerce" />
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 pt-12 relative">
          {/* Profile Image Container */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden ring-4 ring-slate-100">
              <img
                src={user.avatar.url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 text-center mb-8 mt-12">
            My Profile
          </h1>

          <div className="space-y-4">
            {/* Full Name Field */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:bg-slate-100/50">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <p className="text-lg font-semibold text-slate-700">
                {user.name}
              </p>
            </div>

            {/* Email Address Field */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:bg-slate-100/50">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <p className="text-lg font-semibold text-slate-700">
                {user.email}
              </p>
            </div>

            {/* Edit Button */}
            <Link
              to="/profile/update"
              className="block text-center w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
