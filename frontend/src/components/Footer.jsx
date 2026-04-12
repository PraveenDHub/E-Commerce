import { Phone, Mail, Github, Linkedin, Youtube, Instagram, User } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-[#0b1120] text-gray-300 border-t border-gray-700">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        
        {/* Contact Us */}
        <div>
          <h3 className="text-white text-base font-semibold mb-3 tracking-wide italic">
            Contact Us
          </h3>
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
            <Phone size={14} />
            <span>Phone : +91 9345407087</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail size={14} />
            <span>Email : praveenbtech2003@gmail.com</span>
          </div>
        </div>

        {/* Follow Me */}
        <div>
          <h3 className="text-white text-base font-semibold mb-3 tracking-wide italic">
            Follow Me
          </h3>
          <div className="flex items-center gap-4">
            <a href="https://github.com/PraveenDHub" target="_blank" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/praveen-dhanraj" target="_blank" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Linkedin size={18} />
            </a>
            <a href="https://portfolio-site-rho-livid.vercel.app/" target="_blank" className="text-gray-400 hover:text-white transition-colors duration-200">
              <User size={18} />
            </a>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-white text-base font-semibold mb-3 tracking-wide italic">
            About
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Providing professional e-commerce solutions to help you grow your online business.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <p className="text-center text-xs text-gray-500 py-4">
          &copy; 2026 Tutor Joes. All rights reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer