import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Mic, ArrowRight, CheckCircle2, Globe2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { SCHEMES, CATEGORIES } from '../../constants';
import SchemeCard from '../../components/SchemeCard/SchemeCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      navigate(`/schemes?q=${encodeURIComponent(transcript)}`);
    };
    recognition.start();
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-cyan-950 mb-6 tracking-tight">
              SwayamHelp
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium">
              {t('Tagline')}
            </p>

            <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-cyan-900 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('SearchPlaceholder')}
                  className="w-full pl-16 pr-32 py-6 bg-white rounded-full shadow-xl border border-gray-100 focus:ring-4 focus:ring-cyan-100 focus:border-cyan-900 outline-none text-lg transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleVoiceSearch}
                    className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                  >
                    {t('Search')}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('Trending')}:</span>
              {['PM-KISAN', 'Ayushman Bharat', 'Lakhpati Didi', 'PM Vishwakarma'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/schemes?q=${tag}`)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:border-cyan-900 hover:text-cyan-900 transition-all shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: t('HowItWorks'), sub: t('ProjectGuide'), icon: Globe2, color: 'bg-blue-50 text-blue-600', link: '/about' },
            { title: t('CheckEligibility'), sub: t('CheckNow'), icon: CheckCircle2, color: 'bg-green-50 text-green-600', link: '/dashboard' },
            { title: t('OfficialResources'), sub: t('OfficialPortals'), icon: ShieldCheck, color: 'bg-purple-50 text-purple-600', link: '/portals' }
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(action.link)}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6 text-left hover:shadow-md transition-all group"
            >
              <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">{action.title}</h3>
                <p className="text-xl font-bold text-gray-900 flex items-center">
                  {action.sub} <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-cyan-950 mb-2">{t('BrowseByCategory')}</h2>
            <p className="text-gray-500">{t('ExploreByCategory')}</p>
          </div>
          <button className="text-cyan-900 font-bold hover:underline">{t('ViewAll')}</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              onClick={(id) => navigate(`/schemes?category=${id}`)} 
            />
          ))}
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-cyan-950 mb-2">{t('FeaturedSchemes')}</h2>
            <p className="text-gray-500">{t('FeaturedSchemesSub')}</p>
          </div>
          <button className="text-cyan-900 font-bold hover:underline">{t('ViewAllSchemes')}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SCHEMES.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>
    </div>
  );
}
