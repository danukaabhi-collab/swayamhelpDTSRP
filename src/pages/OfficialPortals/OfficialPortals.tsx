import React from 'react';
import { ExternalLink, ShieldCheck, Globe, Landmark, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PORTAL_ICONS = [
  Globe,
  Landmark,
  ShieldCheck,
  Smartphone,
  Globe,
  Globe
];

const PORTAL_COLORS = [
  'bg-blue-50 text-blue-600',
  'bg-green-50 text-green-600',
  'bg-red-50 text-red-600',
  'bg-purple-50 text-purple-600',
  'bg-orange-50 text-orange-600',
  'bg-cyan-50 text-cyan-600'
];

const PORTAL_LINKS = [
  'https://www.india.gov.in/',
  'https://pmkisan.gov.in/',
  'https://pmjay.gov.in/',
  'https://www.digitalindia.gov.in/',
  'https://www.mygov.in/',
  'https://scholarships.gov.in/'
];

export default function OfficialPortals() {
  const { t } = useTranslation();
  const portalsData = t('PortalsList', { returnObjects: true }) as Array<{ name: string, description: string }>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-cyan-950 mb-4">{t('OfficialPortalsTitle')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t('OfficialPortalsSub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(portalsData) && portalsData.map((portal, i) => {
          const Icon = PORTAL_ICONS[i] || Globe;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all group"
            >
              <div className={`w-14 h-14 ${PORTAL_COLORS[i] || 'bg-gray-50 text-gray-600'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{portal.name}</h3>
              <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed">
                {portal.description}
              </p>
              <a
                href={PORTAL_LINKS[i]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-cyan-900 text-white py-3 rounded-xl font-bold hover:bg-cyan-800 transition-colors"
              >
                <span>{t('VisitPortal')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
