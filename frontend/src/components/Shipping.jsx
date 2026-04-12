import { useState } from 'react';
import { MapPin, Phone, Truck, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../features/products/Cart/cartSlice';
import { countries } from 'countries-list';
import CheckoutSteps from './CheckoutSteps';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shippingInfo = useSelector((state) => state.cart.shippingInfo);

  const [formData, setFormData] = useState({
    address: shippingInfo?.address || '',
    city: shippingInfo?.city || '',
    state: shippingInfo?.state || '',
    phone: shippingInfo?.phone || '',
    pinCode: shippingInfo?.pinCode || '',
    country: shippingInfo?.country || 'India',
  });

  const [errors, setErrors] = useState({});

  const countryOptions = Object.entries(countries).map(([code, country]) => ({
    code,
    name: country.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.pinCode.trim()) newErrors.pinCode = "Pincode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(saveShippingInfo(formData));
      navigate("/confirm-order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Checkout Steps */}
        <CheckoutSteps shipping={true} payment={false} confirmOrder={false} />

        <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold">Shipping Details</h2>
                <p className="text-indigo-100 mt-1 text-lg">
                  Enter your delivery information
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            
            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No., Building, Street, Area"
                rows={3}
                className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y min-h-[110px] ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1.5">{errors.address}</p>
              )}
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Chennai"
                  className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1.5">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Tamil Nadu"
                  className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.state ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1.5">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="600001"
                  className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.pinCode ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.pinCode && <p className="text-red-500 text-sm mt-1.5">{errors.pinCode}</p>}
              </div>
            </div>

            {/* Phone & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full px-6 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1.5">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer transition-all"
                >
                  {countryOptions.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-8 mt-8 text-gray-400 text-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Secure Checkout
          </div>
          <div>🔒 SSL Encrypted</div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;