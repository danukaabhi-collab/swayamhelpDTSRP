import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: t('Languages.en') },
    { code: 'hi', name: t('Languages.hi') },
    { code: 'bn', name: t('Languages.bn') },
    { code: 'mr', name: t('Languages.mr') },
    { code: 'te', name: t('Languages.te') },
    { code: 'ta', name: t('Languages.ta') }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-gray-600 hover:text-cyan-900 font-medium">
        <Globe className="w-4 h-4" />
        <span>{t('Language')}</span>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
              i18n.language === lang.code ? 'text-cyan-900 font-bold' : 'text-gray-700'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
