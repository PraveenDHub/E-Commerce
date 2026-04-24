import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  AlertCircle,
  Tag,
  Package,
  IndianRupee,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { createProduct } from "../features/products/productSlice.js";

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

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formLoading, setFormLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    stock: "",
    category: "",
  });

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
    if (selectedFiles.length === 0)
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) return toast.error("Each image must be less than 5MB");

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setSelectedFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
    selectedFiles.forEach((file) => form.append("images", file));

    try {
      const res = await dispatch(createProduct({ formData: form })).unwrap();
      toast.success("Product created successfully!");
      navigate(`/product/${res.product._id}`);
    } catch (err) {
      toast.error(err?.message || "Failed to create product");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Product
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-0.5 ml-7">
          Add a new item to your store's catalog
        </p>
      </div>

      {/* Form Body */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
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
                errors.name ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Layers className="w-4 h-4 text-orange-500" />
              Detailed Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Speak more about your product..."
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none ${
                errors.description ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Price + MRP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <IndianRupee className="w-4 h-4 text-orange-500" />
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  errors.price ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.price}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <IndianRupee className="w-4 h-4 text-orange-500" />
                MRP
              </label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  errors.mrp ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.mrp && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.mrp}
                </p>
              )}
            </div>
          </div>

          {/* Stock + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Package className="w-4 h-4 text-orange-500" />
                Initial Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="e.g. 50"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  errors.stock ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.stock}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Tag className="w-4 h-4 text-orange-500" />
                Product Category
              </label>
              <select
                name="category"
                value={showCustomCategory ? "Other" : formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-white ${
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
                  className="mt-3 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              Product Images
            </label>

            <div className="flex flex-wrap gap-4">
              {/* Upload Box */}
              <label className="relative w-28 h-28 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group">
                <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors mb-1" />
                <span className="text-xs text-gray-400 group-hover:text-orange-500 text-center leading-tight px-2">
                  Upload Images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>

              {/* Image Previews */}
              {imagePreviews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 group"
                >
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {errors.images && (
              <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.images}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
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
  disabled={formLoading}
  className={`flex-1 py-3.5 rounded-xl text-sm font-semibold text-white transition ${
    formLoading 
      ? 'bg-orange-500 cursor-not-allowed disabled:opacity-60' 
      : 'bg-orange-600 hover:bg-orange-700'
  }`}
>
  {formLoading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Creating...</span>
    </div>
  ) : (
    'Create Product'
  )}
</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
