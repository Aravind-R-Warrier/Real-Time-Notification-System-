import React from "react";
import { 
  Home, 
  BarChart3, 
  Bell, 
  Settings, 
  HelpCircle,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Shield,
  Heart
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Changelog", href: "#" },
        { name: "API Docs", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "Community", href: "#" },
        { name: "Status", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
      ]
    }
  ];

  const mobileNavItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:block bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Section */}
            <div className="col-span-3">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">SaaS Dashboard</span>
              </Link>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                Advanced analytics and insights platform for modern businesses.
                Monitor, analyze, and optimize your operations in real-time.
              </p>
              <div className="flex space-x-4 mt-6">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:support@saasdashboard.com" 
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links Sections */}
            {footerLinks.map((section) => (
              <div key={section.title} className="col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Section */}
            <div className="col-span-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Stay Updated
              </h3>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Subscribe to our newsletter for the latest updates and features.
              </p>
              <form className="mt-4 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <span>© {new Date().getFullYear()} SaaS Dashboard. All rights reserved.</span>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Cookie Policy
                </a>
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>by our team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer Navigation */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex justify-around py-3">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                )}
              </Link>
            );
          })}
        </div>
      </footer>
    </>
  );
};

export default Footer;