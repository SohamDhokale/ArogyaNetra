import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Globe, Phone, Clock, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const { isDark, toggleDarkMode } = useTheme();
  const { t, language, changeLanguage } = useLanguage();

  const navLinks = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.about'), path: '/about' },
    { name: t('navbar.partners'), path: '/partners' },
    { name: t('navbar.contact'), path: '/contact' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
  ];

  if (isDashboard) return null; // Don't show main navbar in dashboard

  return (
    <div className="flex flex-col sticky top-0 z-50">
      {/* Top Secondary Navbar */}
      <div className="bg-slate-900 text-slate-300 py-2 text-[10px] md:text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Phone size={12} className="text-blue-400" /> +91 1800 123 4567
            </span>
            <span className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Clock size={12} className="text-blue-400" /> Mon-Sat: 08:00 AM - 09:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/apollo-booking" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md font-bold transition-all">
              <Calendar size={12} /> Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className="bg-cream-50/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-cream-200/50 dark:border-slate-800 transition-colors duration-300"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 group"
              aria-label="ArogyaNetra home"
            >
              <div className="flex items-center transition-transform group-hover:scale-110 duration-300">
                <img src={logo} alt="ArogyaNetra Logo" className="h-10 md:h-12 w-auto" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 font-heading">
                  ArogyaNetra
                </span>
                <span className="text-[8px] md:text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] leading-none">Clinical Intelligence</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-xs uppercase tracking-wider"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 border-l border-cream-200 dark:border-slate-800 pl-8">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguages(!showLanguages)}
                    className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-[10px]"
                  >
                    <Globe size={14} aria-hidden="true" />
                    <span>{language.toUpperCase()}</span>
                  </button>
                  {showLanguages && (
                    <div 
                      className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200"
                      role="menu"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setShowLanguages(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors focus:outline-none ${
                            language === lang.code
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                          role="menuitem"
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-xl bg-cream-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-cream-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </button>

                <Link 
                  to="/login" 
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-sm"
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/signup"
                  className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-xl shadow-slate-900/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {t('navbar.signup')}
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300"
              >
                {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-700 dark:text-slate-300 p-2"
              >
                {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-cream-50 dark:bg-slate-900 border-b border-cream-200 dark:border-slate-700 animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/apollo-booking" onClick={() => setIsOpen(false)} className="block px-3 py-3 mb-2 bg-blue-600 text-white rounded-xl font-black text-center">
                BOOK APPOINTMENT
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 font-bold"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 border-t border-cream-200 dark:border-slate-800 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 font-bold"
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 bg-slate-900 text-white rounded-xl font-bold text-center"
                >
                  {t('navbar.signup')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
