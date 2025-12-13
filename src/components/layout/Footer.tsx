// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:bg-none dark:text-white">
                NexusDash
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Enterprise Saas analytics platform
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <Link
              to="/privacy"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/help"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Help Center
            </Link>
            <a
              href="mailto:support@nexusdash.com"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Contact Us
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} NexusDash. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Version 2.1.0 • Built By Aravind For Demo
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            This is a demo application. Data shown is for demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;