import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Github } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Job Opportunity",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/api/v1/contact", formData);
      toast.success("Message sent successfully! I'll reply soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Job Opportunity",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <div className="text-center px-6 mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
          Let's Connect
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Open to Full Stack Developer opportunities<br />
          Feel free to reach out if you like my work
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-10">
              <h3 className="text-3xl font-semibold text-gray-900 mb-8">Get In Touch</h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-blue-600 font-medium">Email Me</p>
                    <a href="mailto:praveenbtech2003@gmail.com" className="text-lg text-gray-800 hover:text-blue-600 transition-colors">
                      praveenbtech2003@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-blue-600 font-medium">Call / WhatsApp</p>
                    <a href="tel:+919345407087" className="text-lg text-gray-800 hover:text-blue-600 transition-colors">
                      +91 93454 07087
                    </a>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-blue-600 font-medium">Location</p>
                    <p className="text-lg text-gray-800">Chennai, Tamil Nadu, India</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-blue-600 font-medium">Availability</p>
                    <p className="text-lg text-gray-800">Immediate Joiner</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 pl-4">
              <a href="https://www.linkedin.com/in/praveen-dhanraj" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <Linkedin className="w-9 h-9 text-gray-600 hover:text-blue-600" />
              </a>
              <a href="https://github.com/PraveenDHub" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <Github className="w-9 h-9 text-gray-600 hover:text-gray-900" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-10 md:p-14">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-900">Send Me a Message</h2>
                <p className="text-gray-600 mt-2">
                  I'm actively looking for Full Stack Developer roles.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all"
                      placeholder="+91 93454 07087"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all text-gray-800"
                    >
                      <option value="Job Opportunity">Job Opportunity</option>
                      <option value="Freelance Project">Freelance / Project</option>
                      <option value="Internship">Internship</option>
                      <option value="Feedback">Feedback on Project</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={7}
                    className="w-full bg-white border border-gray-300 rounded-3xl px-6 py-5 focus:border-blue-500 outline-none resize-y transition-all"
                    placeholder="I'm impressed with your ShoppingHub project and would like to discuss a Full Stack Developer role..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all font-semibold text-lg py-5 rounded-2xl flex items-center justify-center gap-3 text-white disabled:opacity-70"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                  <Send className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;