import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, RefreshCw, Globe, Zap, MapPin } from 'lucide-react';
import { SCHEMES, CATEGORIES, STATES } from '../../constants';
import SchemeCard from '../../components/SchemeCard/SchemeCard';
import { Scheme } from '../../types';
import { fetchRealtimeSchemes } from '../../services/schemeSyncService';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCategory } from '../../utils/formatters';

export default function SchemesList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const stateParam = searchParams.get('state') || '';
  
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>(SCHEMES);
  const [liveSchemes, setLiveSchemes] = useState<Scheme[]>([]);
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedState, setSelectedState] = useState(stateParam);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let results = SCHEMES;

    if (query) {
      results = results.filter(s => 
        s.schemeName.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (category) {
      results = results.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (stateParam) {
      results = results.filter(s => 
        s.stateApplicability.toLowerCase() === 'all india' || 
        s.stateApplicability.toLowerCase().includes(stateParam.toLowerCase())
      );
    }

    setFilteredSchemes(results);
  }, [query, category, stateParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm, category: selectedCategory, state: selectedState });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedState('');
    setSearchParams({});
    setLiveSchemes([]);
  };

  const syncWithOfficialData = async () => {
    if (!category) return;

    setIsSyncing(true);
    try {
      const categoryTitle = CATEGORIES.find(c => c.id === category)?.title || 'General';
      const results = await fetchRealtimeSchemes(categoryTitle, selectedState || undefined);
      
      const formattedResults: Scheme[] = results.map((s, i) => ({
        id: `live-${i}-${Date.now()}`,
        schemeName: s.schemeName || 'Unknown Scheme',
        ministry: s.ministry || (selectedState ? `Government of ${selectedState}` : 'Government of India'),
        category: s.category || categoryTitle,
        description: s.description || '',
        eligibilityCriteria: 'Refer to official portal',
        eligibility: { ageMin: 0, ageMax: 100, gender: 'All', state: selectedState || 'All' },
        incomeLimit: 'Refer to official portal',
        genderCriteria: 'All',
        stateApplicability: selectedState || 'All India',
        benefits: s.benefits || 'Financial assistance and support',
        documentsRequired: [],
        applicationProcess: 'Apply through official portal',
        officialWebsiteLink: s.officialWebsiteLink || '#',
        helpline: '1800-XXX-XXXX',
        lastUpdated: s.lastUpdated || new Date().toISOString().split('T')[0],
        tags: ['Live', 'Official', selectedState || 'Central']
      }));

      setLiveSchemes(formattedResults);
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (category) {
      syncWithOfficialData();
    } else {
      setLiveSchemes([]);
    }
  }, [category, stateParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" /> {t('Filters')}
            </h3>
            {(query || category || stateParam || liveSchemes.length > 0) && (
              <button onClick={clearFilters} className="text-xs text-red-600 font-bold hover:underline flex items-center">
                <X className="w-3 h-3 mr-1" /> {t('ClearAll')}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('CategoriesLabel')}</p>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchParams({ q: query, category: cat.id, state: selectedState });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    category === cat.id 
                      ? 'bg-cyan-900 text-white font-bold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {(() => {
                    const label = t(`Categories.${cat.id}`);
                    return label.includes('.') ? formatCategory(label) : label;
                  })()}
                </button>
              ))}
            </div>
          </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                <MapPin className="w-3 h-3 mr-1" /> {t('SelectStateOptional')}
              </p>
              <select 
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSearchParams({ q: query, category, state: e.target.value });
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-900"
              >
                <option value="">{t('AllStates')}</option>
                {STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

          <div className="pt-6 border-t border-gray-100">
            <button 
              onClick={syncWithOfficialData}
              disabled={isSyncing}
              className="w-full flex items-center justify-center space-x-2 bg-cyan-50 text-cyan-900 py-3 rounded-xl font-bold text-sm hover:bg-cyan-100 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? t('Syncing') : t('RefreshData')}</span>
            </button>
            <p className="mt-2 text-[10px] text-gray-400 text-center">
              {t('AutoFetchRealTimeStateMix')}
            </p>
          </div>
        </aside>

        {/* Results Area */}
        <main className="flex-grow space-y-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('SearchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
            />
          </form>

          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              {t('Showing')} <span className="font-bold text-gray-900">{filteredSchemes.length + liveSchemes.length}</span> {t('Schemes')}
              {query && <span> {t('For')} "<span className="font-bold text-gray-900">{query}</span>"</span>}
              {category === 'state' && selectedState && <span> {t('In')} <span className="font-bold text-gray-900">{selectedState}</span></span>}
            </p>
            <div className="flex items-center space-x-4">
              {liveSchemes.length > 0 && (
                <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  <Globe className="w-3 h-3" />
                  <span>{t('LiveDataConnected')}</span>
                </div>
              )}
              <button className="flex items-center text-sm font-bold text-gray-600 hover:text-cyan-900">
                <SlidersHorizontal className="w-4 h-4 mr-2" /> {t('SortByRecommended')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {liveSchemes.map((scheme) => (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1">
                    <Zap className="w-2 h-2" />
                    <span>{t('LIVE')}</span>
                  </div>
                  <SchemeCard scheme={scheme} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredSchemes.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
            
            {filteredSchemes.length === 0 && liveSchemes.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('NoSchemesFound')}</h3>
                <p className="text-gray-500">{t('AdjustSearchFilters')}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
