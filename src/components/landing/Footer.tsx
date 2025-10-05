import { Link } from "react-router-dom";
import { GraduationCap, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-hero rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">PragatiPath</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering students nationwide with seamless placement solutions from campus to career.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Ministry of Education, Shastri Bhawan, New Delhi - 110001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-gray-400">1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-gray-400">support@pragatipath.gov.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about-us" className="text-gray-400 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-accent transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-accent transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-400 hover:text-accent transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Users</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-accent transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-accent transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Student Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Recruiter Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Social Media */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Placement Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Training Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Downloads
                </a>
              </li>
            </ul>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Connect With Us</h4>
              <div className="flex gap-2">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © 2025 National Training & Placement Portal. All rights reserved. A Government of India Initiative.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-700">|</span>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-700">|</span>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
