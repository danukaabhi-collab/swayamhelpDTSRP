import React, { useState, useEffect } from 'react';
import { UserProfile, Scheme, Application } from '../../types';
import { 
  User, 
  Settings as SettingsIcon, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Bookmark, 
  HelpCircle, 
  ChevronRight, 
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  ShieldCheck,
  UserCircle,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEMES } from '../../constants';
import SchemeCard from '../../components/SchemeCard/SchemeCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth, db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile: authProfile, signOut, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!authProfile) {
      setLoading(false);
      return;
    }

    const path = 'applications';
    const q = query(collection(db, 'applications'), where('userId', '==', authProfile.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      setApplications(appsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authProfile, authLoading]);

  const userProfile = authProfile;

  const eligibleSchemes = SCHEMES.filter(scheme => {
    if (!userProfile) return false;
    
    // Age check
    const ageMatch = userProfile.age >= scheme.eligibility.ageMin && userProfile.age <= scheme.eligibility.ageMax;
    
    // Gender check
    const genderMatch = scheme.eligibility.gender === 'All' || scheme.eligibility.gender === userProfile.gender;
    
    // State check
    const stateMatch = scheme.eligibility.state === 'All' || scheme.eligibility.state === userProfile.residence;

    // Caste check
    const casteMatch = !scheme.eligibility.caste || 
                      scheme.eligibility.caste.length === 0 || 
                      scheme.eligibility.caste.includes('All') ||
                      scheme.eligibility.caste.includes(userProfile.casteCategory);

    // Income check
    let incomeMatch = true;
    if (scheme.eligibility.incomeMax) {
      // Map income range string to numeric value for comparison
      const incomeMap: Record<string, number> = {
        'Below ₹1 Lakh': 100000,
        '₹1 Lakh - ₹2.5 Lakh': 250000,
        '₹2.5 Lakh - ₹5 Lakh': 500000,
        '₹5 Lakh - ₹10 Lakh': 1000000,
        'Above ₹10 Lakh': 99999999
      };
      const userIncome = incomeMap[userProfile.annualIncomeRange] || 0;
      incomeMatch = userIncome <= scheme.eligibility.incomeMax;
    }
    
    return ageMatch && genderMatch && stateMatch && casteMatch && incomeMatch;
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-50';
      case 'Under Review': return 'text-blue-600 bg-blue-50';
      case 'Rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Approved': return t('Approved');
      case 'Under Review': return t('UnderReview');
      case 'Rejected': return t('Rejected');
      default: return status;
    }
  };

  const getAvatar = () => {
    if (!userProfile) return null;
    if (userProfile.avatarType === 'initials') {
      return (
        <div className="w-24 h-24 bg-cyan-900 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-cyan-100 ring-4 ring-white">
          {userProfile.fullName.split(' ').map(n => n[0]).join('')}
        </div>
      );
    }
    if (userProfile.avatarType === 'ai') {
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-900 to-indigo-900 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-cyan-100 ring-4 ring-white relative overflow-hidden">
          <ShieldCheck className="w-12 h-12 relative z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent animate-pulse"></div>
        </div>
      );
    }
    return (
      <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 shadow-xl ring-4 ring-white relative group cursor-pointer">
        <UserCircle className="w-12 h-12" />
        <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-900 font-bold animate-pulse">{t('LoadingDashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-cyan-950">{t('WelcomeBack')}, {userProfile?.fullName.split(' ')[0]}!</h1>
            <p className="text-gray-500 mt-1">{t('DashboardSub')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNotifications}
              className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-cyan-900 transition-all shadow-sm relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={handleSettings}
              className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-cyan-900 transition-all shadow-sm"
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('Logout')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 text-center">
              <div className="flex justify-center mb-6">
                {getAvatar()}
              </div>
              <h2 className="text-xl font-bold text-cyan-950">{userProfile?.fullName}</h2>
              <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-wider">{userProfile?.occupation}</p>
              
              <div className="mt-8 pt-8 border-t border-gray-50 space-y-2">
                {[
                  { id: 'overview', label: t('Overview'), icon: LayoutDashboard },
                  { id: 'schemes', label: t('EligibleSchemes'), icon: FileText, count: eligibleSchemes.length },
                  { id: 'applications', label: t('MyApplications'), icon: CheckCircle, count: applications.length },
                  { id: 'saved', label: t('SavedItems'), icon: Bookmark },
                  { id: 'profile', label: t('ProfileSettings'), icon: User, action: () => navigate('/profile') },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => item.action ? item.action() : setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                      activeTab === item.id 
                        ? 'bg-cyan-900 text-white shadow-lg shadow-cyan-100' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        activeTab === item.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-900 to-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-cyan-100">
              <h3 className="font-bold text-lg mb-2">{t('NeedHelp')}</h3>
              <p className="text-cyan-100 text-sm mb-6">{t('AiAssistantSub')}</p>
              <button 
                onClick={() => navigate('/help')}
                className="w-full py-3 bg-white text-cyan-900 rounded-xl font-bold hover:bg-cyan-50 transition-all flex items-center justify-center space-x-2"
              >
                <HelpCircle className="w-5 h-5" />
                <span>{t('GetSupport')}</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{t('EligibleSchemes')}</p>
                        <h3 className="text-3xl font-bold text-cyan-950 mt-1">{eligibleSchemes.length}</h3>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                          <Clock className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{t('InProgress')}</p>
                        <h3 className="text-3xl font-bold text-cyan-950 mt-1">
                          {applications.filter(a => a.status === 'Under Review').length}
                        </h3>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                          <Bookmark className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{t('SavedItems')}</p>
                        <h3 className="text-3xl font-bold text-cyan-950 mt-1">0</h3>
                      </div>
                    </div>

                  {/* Recent Applications */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-cyan-950">{t('RecentApplications')}</h3>
                        <button onClick={() => setActiveTab('applications')} className="text-cyan-900 font-bold text-sm hover:underline">{t('ViewAll')}</button>
                      </div>
                    <div className="p-4">
                      {applications.length > 0 ? (
                        <div className="space-y-2">
                          {applications.slice(0, 3).map((app) => (
                            <div key={app.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">{app.schemeName}</h4>
                                  <p className="text-xs text-gray-400">{t('AppliedOn')} {new Date(app.appliedDate).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className={`px-4 py-2 rounded-xl text-xs font-bold ${getStatusColor(app.status)}`}>
                                {getStatusLabel(app.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-300" />
                          </div>
                          <p className="text-gray-400 font-medium">{t('NoApplicationsYet')}</p>
                          <button 
                            onClick={() => setActiveTab('schemes')}
                            className="mt-4 text-cyan-900 font-bold hover:underline"
                          >
                            {t('ExploreSchemes')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommended for You */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-cyan-950">{t('RecommendedForYou')}</h3>
                        <button onClick={() => setActiveTab('schemes')} className="text-cyan-900 font-bold text-sm hover:underline">{t('ViewAll')}</button>
                      </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {eligibleSchemes.slice(0, 2).map((scheme) => (
                        <SchemeCard key={scheme.id} scheme={scheme} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'schemes' && (
                <motion.div
                  key="schemes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-cyan-950">{t('EligibleSchemes')}</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder={t('SearchEligibleSchemes')}
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-900 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {eligibleSchemes.map((scheme) => (
                      <SchemeCard key={scheme.id} scheme={scheme} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'applications' && (
                <motion.div
                  key="applications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl font-bold text-cyan-950 mb-8">{t('MyApplications')}</h2>
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('SchemeName')}</th>
                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('AppliedDate')}</th>
                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Status')}</th>
                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{t('Action')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50/50 transition-all">
                              <td className="px-8 py-6">
                                <span className="font-bold text-gray-900">{app.schemeName}</span>
                              </td>
                              <td className="px-8 py-6 text-gray-500">
                                {new Date(app.appliedDate).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-4 py-2 rounded-xl text-xs font-bold ${getStatusColor(app.status)}`}>
                                  {getStatusLabel(app.status)}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <button className="text-cyan-900 font-bold hover:underline flex items-center space-x-1">
                                  <span>{t('Details')}</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
