import React, { useState } from 'react';
import { Settings as SettingsIcon, ArrowLeft, Bell, Lock, Globe, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8 flex items-center space-x-4">
          <Link to="/dashboard" className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-cyan-900 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-cyan-950">{t('Settings')}</h1>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center space-x-3">
              <User className="w-6 h-6 text-cyan-900" />
              <h2 className="text-xl font-bold text-cyan-950">{t('AccountSettings')}</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{t('ProfileVisibility')}</h3>
                  <p className="text-sm text-gray-500">{t('ProfileVisibilitySub')}</p>
                </div>
                <button className="w-12 h-6 bg-cyan-900 rounded-full relative transition-all">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{t('EmailNotifications')}</h3>
                  <p className="text-sm text-gray-500">{t('EmailNotificationsSub')}</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full relative transition-all ${notifications ? 'bg-cyan-900' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center space-x-3">
              <Globe className="w-6 h-6 text-cyan-900" />
              <h2 className="text-xl font-bold text-cyan-950">{t('Preferences')}</h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">{t('Language')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => changeLanguage('en')}
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${
                      i18n.language === 'en' ? 'border-cyan-900 bg-cyan-50 text-cyan-900' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => changeLanguage('hi')}
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${
                      i18n.language === 'hi' ? 'border-cyan-900 bg-cyan-50 text-cyan-900' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center space-x-3">
              <Shield className="w-6 h-6 text-cyan-900" />
              <h2 className="text-xl font-bold text-cyan-950">{t('Security')}</h2>
            </div>
            <div className="p-8 space-y-4">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-gray-700">{t('ChangePassword')}</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-300 rotate-180" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-gray-700">{t('TwoFactorAuth')}</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-300 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
