import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  CreditCard, 
  Users,
  Camera,
  ShieldCheck,
  UserCircle,
  Save,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Edit2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { STATES, CASTE_CATEGORIES, QUALIFICATIONS, OCCUPATIONS, INCOME_RANGES } from '../../constants';

export default function Profile() {
  const { profile, user, signOut, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        age: profile.age,
        gender: profile.gender,
        casteCategory: profile.casteCategory,
        qualification: profile.qualification,
        occupation: profile.occupation,
        residence: profile.residence,
        annualIncomeRange: profile.annualIncomeRange,
        avatarType: profile.avatarType || 'initials'
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const path = `profiles/${user.uid}`;
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        ...formData,
        age: Number(formData.age)
      });
      setMessage({ type: 'success', text: t('ProfileUpdatedSuccessfully') });
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `profiles/${user?.uid}`);
      setMessage({ type: 'error', text: t('FailedToUpdateProfile') });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getAvatar = () => {
    if (!profile) return null;
    if (profile.avatarType === 'initials') {
      return (
        <div className="w-32 h-32 bg-cyan-900 rounded-[2rem] flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-cyan-100 ring-4 ring-white">
          {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
      );
    }
    if (profile.avatarType === 'ai') {
      return (
        <div className="w-32 h-32 bg-gradient-to-br from-cyan-900 to-indigo-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-cyan-100 ring-4 ring-white relative overflow-hidden">
          <ShieldCheck className="w-16 h-16 relative z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent animate-pulse"></div>
        </div>
      );
    }
    return (
      <div className="w-32 h-32 bg-gray-100 rounded-[2rem] flex items-center justify-center text-gray-400 shadow-2xl ring-4 ring-white relative group cursor-pointer">
        <UserCircle className="w-16 h-16" />
        <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>
    );
  };

  if (authLoading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-900 font-bold animate-pulse">{t('LoadingProfile')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-500 hover:text-cyan-900 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{t('BackToDashboard')}</span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Header/Cover */}
          <div className="h-48 bg-gradient-to-r from-cyan-900 to-indigo-900 relative">
            <div className="absolute -bottom-16 left-10">
              {getAvatar()}
            </div>
          </div>

          <div className="pt-20 px-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-cyan-950">{profile?.fullName}</h1>
                <p className="text-gray-500 font-medium flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-cyan-900 text-white rounded-2xl font-bold hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-100 flex items-center space-x-2"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('EditProfile')}</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    {t('Cancel')}
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all border border-red-100"
                  title={t('Logout')}
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl mb-8 font-bold text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-cyan-950 flex items-center">
                    <User className="w-5 h-5 mr-2 text-cyan-900" />
                    {t('PersonalInformation')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('FullName')}</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all disabled:opacity-60"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Age')}</label>
                        <input 
                          type="number" 
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Gender')}</label>
                        <select 
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all disabled:opacity-60"
                        >
                          <option value="Male">{t('Genders.Male')}</option>
                          <option value="Female">{t('Genders.Female')}</option>
                          <option value="Other">{t('Genders.Other')}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('CasteCategory')}</label>
                      <select 
                        name="casteCategory"
                        value={formData.casteCategory}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all disabled:opacity-60"
                      >
                        {CASTE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-cyan-950 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-cyan-900" />
                    {t('ProfessionalDetails')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Qualification')}</label>
                      <select 
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all disabled:opacity-60"
                      >
                        {QUALIFICATIONS.map(q => <option key={q} value={q}>{t(`Qualifications.${q}`)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Occupation')}</label>
                      <select 
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all disabled:opacity-60"
                      >
                        {OCCUPATIONS.map(o => <option key={o} value={o}>{t(`Occupations.${o}`)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('AnnualIncome')}</label>
                      <select 
                        name="annualIncomeRange"
                        value={formData.annualIncomeRange}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all disabled:opacity-60"
                      >
                        {INCOME_RANGES.map(i => <option key={i} value={i}>{t(`IncomeRanges.${i}`)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('ResidenceState')}</label>
                      <select 
                        name="residence"
                        value={formData.residence}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all disabled:opacity-60"
                      >
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-10 border-t border-gray-50"
                >
                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full py-5 bg-cyan-900 text-white rounded-[2rem] font-bold hover:bg-cyan-800 transition-all shadow-xl shadow-cyan-100 flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-6 h-6" />
                        <span>{t('SaveProfileChanges')}</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </form>
          </div>
        </div>

        {/* Account Security Section */}
        <div className="mt-10 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-cyan-950 mb-6 flex items-center">
            <ShieldCheck className="w-6 h-6 mr-3 text-cyan-900" />
            {t('AccountSecurity')}
          </h3>
          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
            <div>
              <h4 className="font-bold text-gray-900">{t('Password')}</h4>
              <p className="text-sm text-gray-500">{t('LastChanged')} 3 {t('MonthsAgo')}</p>
            </div>
            <button 
              onClick={() => navigate('/forgot-password')}
              className="px-6 py-3 bg-white border border-gray-200 text-cyan-900 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              {t('ChangePassword')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
