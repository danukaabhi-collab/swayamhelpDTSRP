import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ExternalLink, CheckCircle, ArrowLeft, FileText, Landmark, Users, Info, HelpCircle, AlertTriangle, BadgeCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEMES } from '../../constants';
import { Scheme } from '../../types';
import { useTranslation } from 'react-i18next';
import { formatCategory } from '../../utils/formatters';

export default function SchemeDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 1. Check if scheme was passed via navigation state (for live schemes)
    if (location.state?.scheme) {
      setScheme(location.state.scheme);
      return;
    }

    // 2. Otherwise look in local constants
    const found = SCHEMES.find(s => s.id === id);
    if (found) setScheme(found);
  }, [id, location.state]);

  const handleSave = async () => {
    if (!scheme) return;

    setIsSaving(true);
    // Mock save
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 1000);
  };

  if (!scheme) return <div className="p-20 text-center">{t('SchemeNotFound')}</div>;

  const categoryLabel = t(`Categories.${scheme.category}`);
  const displayCategory = categoryLabel.includes('.') ? formatCategory(categoryLabel) : categoryLabel;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-cyan-900 font-bold mb-8 hover:translate-x-1 transition-transform">
        <ArrowLeft className="w-5 h-5 mr-2" /> {t('BackToHome')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold uppercase rounded-full tracking-wider">
                {displayCategory}
              </span>
              {scheme.id.startsWith('live-') ? (
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase rounded-full tracking-wider flex items-center shadow-sm">
                  <Zap className="w-3 h-3 mr-1" /> {t('LiveRealTimeData')}
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-full tracking-wider flex items-center">
                  <BadgeCheck className="w-3 h-3 mr-1" /> {t('VerifiedData')}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-cyan-950 mb-4 leading-tight">{scheme.schemeName}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
              <p className="flex items-center"><Landmark className="w-4 h-4 mr-2" /> {scheme.ministry}</p>
              <p className="flex items-center"><HelpCircle className="w-4 h-4 mr-2" /> {t('LastUpdated')}: {scheme.lastUpdated}</p>
            </div>
          </motion.div>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-cyan-900" /> {t('Overview')}
            </h3>
            <p className="text-gray-600 leading-relaxed">{scheme.description}</p>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-cyan-900" /> {t('EligibilityCriteria')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('GeneralCriteria')}</p>
                <p className="text-sm text-gray-700">{scheme.eligibilityCriteria}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('IncomeLimit')}</p>
                <p className="text-sm text-gray-700">{scheme.incomeLimit}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('AgeRequirement')}</p>
                <p className="text-sm text-gray-700">{scheme.ageRequirement || t('NotSpecified')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('StateApplicability')}</p>
                <p className="text-sm text-gray-700">{scheme.stateApplicability}</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-cyan-900" /> {t('RequiredDocuments')}
            </h3>
            <div className="space-y-4">
              {scheme.documentsRequired.length > 0 ? (
                scheme.documentsRequired.map((doc, i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <div className="mt-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-800">📄 {doc.name}</span>
                        {doc.description && (
                          <div className="relative group/tooltip">
                            <Info className="w-3.5 h-3.5 text-gray-300 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10">
                              {doc.description}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                  <p className="text-gray-500 text-sm italic">
                    {t('SpecificDocumentListNotAvailable')}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BadgeCheck className="w-5 h-5 mr-2 text-cyan-900" /> {t('ApplicationProcess')}
            </h3>
            <div className="p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {scheme.applicationProcess || t('ApplicationProcessSub')}
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
            <h4 className="text-lg font-bold text-gray-900 mb-6">{t('Benefits')}</h4>
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 mb-8">
              <p className="text-sm text-green-800 font-medium leading-relaxed">{scheme.benefits}</p>
            </div>

            <div className="space-y-4">
              <a 
                href={scheme.officialWebsiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-cyan-900 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-100"
              >
                <span>{t('ApplyOnOfficialPortal')}</span>
                <ExternalLink className="w-5 h-5" />
              </a>
              
              <button 
                onClick={handleSave}
                disabled={isSaved || isSaving}
                className={`w-full py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center space-x-2 ${
                  isSaved 
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-default' 
                    : 'bg-white border-cyan-900 text-cyan-900 hover:bg-cyan-50'
                }`}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-cyan-900 border-t-transparent rounded-full animate-spin"></div>
                ) : isSaved ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{t('SavedToDashboard')}</span>
                  </>
                ) : (
                  <span>{t('SaveForLater')}</span>
                )}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <BadgeCheck className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tighter">{t('OfficialGovernmentPortal')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

