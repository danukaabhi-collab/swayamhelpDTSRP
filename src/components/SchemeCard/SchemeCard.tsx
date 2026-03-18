import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight, Info } from 'lucide-react';
import { Scheme } from '../../types';
import { useTranslation } from 'react-i18next';
import { formatCategory } from '../../utils/formatters';

interface SchemeCardProps {
  scheme: Scheme;
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
  const { t } = useTranslation();
  
  const categoryLabel = t(`Categories.${scheme.category}`);
  const displayCategory = categoryLabel.includes('.') ? formatCategory(categoryLabel) : categoryLabel;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-bold uppercase rounded-full tracking-wider">
            {displayCategory}
          </span>
          <Info className="w-4 h-4 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {scheme.schemeName}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
          {scheme.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
            <p className="text-xs text-gray-600"><span className="font-semibold">{t('Eligibility')}:</span> {scheme.eligibilityCriteria}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <a 
          href={scheme.officialWebsiteLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-900 text-sm font-semibold flex items-center hover:underline"
        >
          {t('OfficialPortal')} <ExternalLink className="w-3 h-3 ml-1" />
        </a>
        <Link 
          to={`/scheme/${scheme.id}`}
          state={{ scheme }}
          className="text-green-600 text-sm font-semibold flex items-center hover:translate-x-1 transition-transform"
        >
          {t('Details')} <ChevronRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}
