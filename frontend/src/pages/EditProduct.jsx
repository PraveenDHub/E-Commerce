import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertCircle,
  Tag,
  Package,
  IndianRupee,
  Layers,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import {
  getAdminProducts,
  updateProduct,
} from "../features/products/productSlice.js";

const commonCategories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Accessories",
  "Footwear",
  "Books",
  "Jewelry",
  "Dress",
];

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);

  const [formLoading, setFormLoading] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});

  // Existing images from server
  const [existingImages, setExistingImages] = useState([]);
  // New files picked by user
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [originalProduct, setOriginalProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    stock: "",
    category: "",
  });

  // Redirect non-admins
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      toast.error("Not authorized");
    }
  }, [user]);

  // Pre-fill form from Redux store
  useEffect(() => {
    if (!products?.length) {
      dispatch(getAdminProducts());
      return;
    }
    const product = products.find((p) => p._id === id);
    if (!product) {
      toast.error("Product not found");
      navigate("/admin/products");
      return;
    }

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      mrp: product.mrp || "",
      stock: product.stock || "",
      category: product.category || "",
    });

    setExistingImages(product.images || []);
    setShowCustomCategory(!commonCategories.includes(product.category));
    setOriginalProduct(product);
  }, [products, id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Product name is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.mrp || formData.mrp <= 0)
      newErrors.mrp = "Valid MRP is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.stock || formData.stock < 0)
      newErrors.stock = "Valid stock quantity is required";
    if (existingImages.length === 0 && newFiles.length === 0)
      newErrors.images = "At least one product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "category") setShowCustomCategory(value === "Other");
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) return toast.error("Each image must be less than 5MB");
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...previews]);
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const hasChanges = () => {
    if (!originalProduct) return false;

    const basicChanged =
      formData.name !== originalProduct.name ||
      formData.description !== originalProduct.description ||
      Number(formData.price) !== originalProduct.price ||
      Number(formData.mrp) !== originalProduct.mrp ||
      Number(formData.stock) !== originalProduct.stock ||
      formData.category !== originalProduct.category;

    const imagesChanged =
      newFiles.length > 0 ||
      existingImages.length !== originalProduct.images.length ||
      JSON.stringify(existingImages.map((i) => i.url)) !==
        JSON.stringify(originalProduct.images.map((i) => i.url));

    return basicChanged || imagesChanged;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", Number(formData.price));
    form.append("mrp", Number(formData.mrp));
    form.append("category", formData.category);
    form.append("stock", Number(formData.stock));
    // Send existing image URLs so backend knows which to keep
    form.append("existingImages", JSON.stringify(existingImages));
    newFiles.forEach((file) => form.append("images", file));

    try {
      await dispatch(updateProduct({ id, formData: form })).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.message || "Failed to update product");
    } finally {
      setFormLoading(false);
    }
  };

  const totalImages = existingImages.length + newFiles.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
        <div className="flex items-center gap-2">
          <Pencil className="w-5 h-5 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        </div>
        <p className="text-sm text-gray-500 mt-0.5 ml-7">
          Update the details of this product
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Tag className="w-4 h-4 text-orange-500" />
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Stylish Cotton Blend Casual Shirt"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                errors.name
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-gray-50 focus:bg-white"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Layers className="w-4 h-4 text-orange-500" />
              Detailed Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your product in detail..."
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none ${
                errors.description
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-gray-50 focus:bg-white"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Price + MRP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <IndianRupee className="w-4 h-4 text-orange-500" />
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  errors.price
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.price}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <IndianRupee className="w-4 h-4 text-orange-500" />
                MRP (₹)
              </label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  errors.mrp
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
              />
              {errors.mrp && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.mrp}
                </p>
              )}
            </div>
          </div>

          {/* Stock + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Package className="w-4 h-4 text-orange-500" />
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="e.g. 50"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  errors.stock
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.stock}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Tag className="w-4 h-4 text-orange-500" />
                Product Category
              </label>
              <select
                name="category"
                value={showCustomCategory ? "Other" : formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-gray-50 focus:bg-white ${
                  errors.category ? "border-red-400" : "border-gray-200"
                }`}
              >
                <option value="">Select a Category</option>
                {commonCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">Other (Custom)</option>
              </select>
              {showCustomCategory && (
                <input
                  type="text"
                  value={formData.category === "Other" ? "" : formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="Enter custom category"
                  className="mt-3 w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                Product Images
              </label>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {totalImages} image{totalImages !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Upload Button */}
              <label className="relative w-28 h-28 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group">
                <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors mb-1" />
                <span className="text-xs text-gray-400 group-hover:text-orange-500 text-center leading-tight px-2">
                  Add Images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImages}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>

              {/* Existing server images */}
              {existingImages.map((img, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-orange-200 group shadow-sm"
                >
                  <img
                    src={img.url}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* "Saved" badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-orange-500/80 text-white text-[10px] text-center py-0.5 font-medium">
                    Saved
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Newly added images */}
              {newPreviews.map((src, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-blue-200 group shadow-sm"
                >
                  <img
                    src={src}
                    alt={`New ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* "New" badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[10px] text-center py-0.5 font-medium">
                    New
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Legend */}
            {totalImages > 0 && (
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
                  Saved — already on server
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
                  New — will be uploaded
                </span>
              </div>
            )}

            {errors.images && (
              <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.images}
              </p>
            )}
          </div>

          {/* Discount Preview */}
          {formData.price &&
            formData.mrp &&
            Number(formData.mrp) > Number(formData.price) && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Discount Preview
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Customer saves ₹
                    {(
                      Number(formData.mrp) - Number(formData.price)
                    ).toLocaleString()}
                  </p>
                </div>
                <span className="text-2xl font-bold text-emerald-600">
                  {Math.round(
                    ((formData.mrp - formData.price) / formData.mrp) * 100,
                  )}
                  % OFF
                </span>
              </div>
            )}

          {/* Buttons */}
          <div className="flex gap-4 pb-8">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 py-3.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading || !hasChanges()}
              className={`flex-1 py-3.5 rounded-xl text-sm font-semibold text-white transition flex items-center justify-center gap-2 ${
                formLoading
                  ? "bg-orange-500 cursor-not-allowed disabled:opacity-60"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {formLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
