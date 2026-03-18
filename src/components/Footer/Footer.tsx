import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-cyan-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-cyan-950 font-bold">
                SH
              </div>
              <span className="text-xl font-bold">SwayamHelp</span>
            </div>
            <p className="text-cyan-100 text-sm leading-relaxed">
              {t('Footer.Description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-400 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-green-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-green-400 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{t('Footer.QuickLinks')}</h4>
            <ul className="space-y-3 text-cyan-100 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">{t('Home')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('AboutUs')}</Link></li>
              <li><Link to="/schemes" className="hover:text-white transition-colors">{t('Navbar.Schemes')}</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">{t('HelpSupport')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{t('Footer.Legal')}</h4>
            <ul className="space-y-3 text-cyan-100 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">{t('Footer.FAQs')}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t('Footer.Privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t('Footer.Terms')}</Link></li>
              <li><Link to="/portals" className="hover:text-white transition-colors">{t('Footer.OfficialPortals')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{t('Footer.ContactUs')}</h4>
            <ul className="space-y-4 text-cyan-100 text-sm">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-green-400 shrink-0" />
                <span>support@swayamhelp.gov.in</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-400 shrink-0" />
                <span>1800-123-4567 ({t('Footer.TollFree')})</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyan-900 pt-8 text-center text-cyan-300 text-xs">
          <p>© {new Date().getFullYear()} SwayamHelp. {t('Footer.AllRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
