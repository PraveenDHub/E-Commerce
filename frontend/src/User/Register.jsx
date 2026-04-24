import { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  register,
  removeError,
  removeSuccess,
} from "../features/products/User/userSlice";

const Register = () => {
  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  );

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, success } = useSelector(
    (state) => state.user,
  );

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if (file) {
        setPreview(URL.createObjectURL(file)); // ✅ preview
        setAvatar(file); // ✅ actual file
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const registerNow = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !avatar) {
      toast.error("Please fill all the fields");
      return;
    }
    if(loading) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar); // ✅ file

    dispatch(register(formData));
  };

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
      <PageTitle title="Register | E-Commerce" />
      <div className="bg-slate-50 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <form
            encType="multipart/form-data"
            onSubmit={registerNow}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                Create Account
              </h2>
              <p className="text-gray-600 mt-2">
                Join us and start your journey
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700 font-medium ml-1">
                Username
              </label>
              <input
                type="text"
                value={name}
                onChange={handleChange}
                name="name"
                placeholder="John Doe" id="name" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700 font-medium ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="example@gmail.com" name="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700 font-medium ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••" name="password" id="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="flex items-center space-x-4">
              {" "}
              <div className="shrink-0">
                {" "}
                <img
                  src={preview}
                  alt="Profile"
                  id="preview"
                  className="w-12 h-12 rounded-sm object-cover bg-gray-100"
                />
              </div>
              <label
                htmlFor="avatar"
                className="block text-sm text-gray-700 font-medium ml-1"
              >
                <span className="sr-only">Choose Profile Picture</span>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  id="avatar"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-blue-600 hover:file:bg-violet-100"
                />
              </label>
              <small className="text-gray-500 whitespace-nowrap">
                Max 8mb
              </small>
            </div>

            <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300
    ${
      loading
        ? "bg-gray-400 text-amber-50/40 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700 shadow-lg text-white shadow-indigo-200 active:scale-95"
    }`}
>
  {loading ? (
    <>
      {/* Spinner */}
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>

      Processing...
    </>
  ) : (
    "Sign Up"
  )}
</button>
            {/* <button disabled={loading} type="submit" className={`${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} bg-indigo-600 hover:bg-indigo-700 w-full text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-all duration-300`}>{loading ? "Loading..." : "Sign Up"}</button> */}

            <p className="text-gray-600 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
