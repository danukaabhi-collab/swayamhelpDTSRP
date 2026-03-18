import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, LogOut, Settings, Bell, LayoutDashboard } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-cyan-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                SH
              </div>
              <span className="text-xl font-bold text-cyan-950 hidden sm:block">SwayamHelp</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-cyan-900 font-medium">{t('Home')}</Link>
            <Link to="/schemes" className="text-gray-600 hover:text-cyan-900 font-medium">{t('Schemes')}</Link>
            <Link to="/about" className="text-gray-600 hover:text-cyan-900 font-medium">{t('AboutUs')}</Link>
            <Link to="/support" className="text-gray-600 hover:text-cyan-900 font-medium">{t('HelpSupport')}</Link>
            
            <LanguageSwitcher />

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-50 transition-all border border-gray-100"
                  >
                    <div className="w-9 h-9 bg-cyan-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {profile?.fullName ? getInitials(profile.fullName) : <User className="w-5 h-5" />}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-sm font-bold text-cyan-950 truncate">{profile?.fullName}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link 
                            to="/dashboard" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-cyan-900 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>{t('Dashboard')}</span>
                          </Link>
                          <Link 
                            to="/profile" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-cyan-900 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>{t('Profile')}</span>
                          </Link>
                          <Link 
                            to="/settings" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-cyan-900 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>{t('Settings')}</span>
                          </Link>
                        </div>
                        <div className="border-t border-gray-50 pt-1">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{t('Logout')}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-cyan-900 font-medium hover:underline">{t('Login')}</Link>
                  <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    {t('SignUp')}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">
          <Link to="/" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>{t('Home')}</Link>
          <Link to="/schemes" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>{t('Schemes')}</Link>
          <Link to="/about" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>{t('AboutUs')}</Link>
          <Link to="/support" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>{t('HelpSupport')}</Link>
          
          {user ? (
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-10 h-10 bg-cyan-900 rounded-full flex items-center justify-center text-white font-bold">
                  {profile?.fullName ? getInitials(profile.fullName) : <User className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-cyan-950">{profile?.fullName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <Link to="/dashboard" className="block text-gray-600 font-medium px-2" onClick={() => setIsMenuOpen(false)}>{t('Dashboard')}</Link>
              <Link to="/profile" className="block text-gray-600 font-medium px-2" onClick={() => setIsMenuOpen(false)}>{t('Profile')}</Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left text-red-600 font-medium px-2"
              >
                {t('Logout')}
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <Link to="/login" className="block text-cyan-900 font-medium" onClick={() => setIsMenuOpen(false)}>{t('Login')}</Link>
              <Link to="/signup" className="block bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-center" onClick={() => setIsMenuOpen(false)}>
                {t('SignUp')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
