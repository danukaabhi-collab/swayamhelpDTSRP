import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ChevronRight, ArrowLeft, ShieldCheck, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATES, CASTE_CATEGORIES, QUALIFICATIONS, OCCUPATIONS, INCOME_RANGES } from '../../constants';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    casteCategory: 'General',
    qualification: 'Graduate',
    occupation: 'Student',
    residence: 'Delhi',
    annualIncomeRange: 'Below ₹1 Lakh',
    avatarType: 'initials' as 'initials' | 'upload' | 'ai'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          uid: user.uid,
          fullName: user.displayName || 'Google User',
          email: user.email,
          age: 0,
          gender: 'Other',
          casteCategory: 'General',
          qualification: 'Graduate',
          occupation: 'Student',
          residence: 'Delhi',
          annualIncomeRange: 'Below ₹1 Lakh',
          avatarType: 'initials',
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'Google signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sign up user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;

      // 2. Update Auth Profile
      await updateProfile(user, {
        displayName: formData.fullName
      });

      // 3. Create profile in Firestore 'profiles' collection
      await setDoc(doc(db, 'profiles', user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        age: parseInt(formData.age),
        gender: formData.gender,
        casteCategory: formData.casteCategory,
        qualification: formData.qualification,
        occupation: formData.occupation,
        residence: formData.residence,
        annualIncomeRange: formData.annualIncomeRange,
        avatarType: formData.avatarType,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled in the Firebase Console. Please enable it in the Authentication tab.');
      } else {
        setError(err.message || 'An error occurred during signup.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-cyan-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-100">S</div>
        </Link>
        <h2 className="text-center text-3xl font-bold text-cyan-950">{t('CreateAccount')}</h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {t('AlreadyHaveAccount')}{' '}
          <Link to="/login" className="font-bold text-cyan-900 hover:text-cyan-800">{t('SignIn')}</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-12 border border-gray-100">
          <div className="mb-10 flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s ? 'bg-cyan-900 text-white shadow-lg shadow-cyan-100' : 'bg-gray-100 text-gray-400'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-12 h-1 bg-gray-100 mx-2 rounded-full overflow-hidden`}>
                  <div className={`h-full bg-cyan-900 transition-all duration-500 ${step > s ? 'w-full' : 'w-0'}`}></div>
                </div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('BasicInformation')}</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('FullName')}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
                        placeholder={t('FullNamePlaceholder')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('EmailAddress')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-cyan-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-100"
                  >
                    <span>{t('Continue')}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('EligibilityDetails')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Age')}</label>
                      <input
                        name="age"
                        type="number"
                        required
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Gender')}</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
                      >
                        <option value="Male">{t('Male')}</option>
                        <option value="Female">{t('Female')}</option>
                        <option value="Other">{t('Other')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('CasteCategory')}</label>
                      <select
                        name="casteCategory"
                        value={formData.casteCategory}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
                      >
                        {CASTE_CATEGORIES.map(c => <option key={c} value={c}>{t(`CasteCategories.${c}`)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('State')}</label>
                      <select
                        name="residence"
                        value={formData.residence}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
                      >
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>{t('Back')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 bg-cyan-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-100"
                    >
                      <span>{t('Continue')}</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('FinalTouches')}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Occupation')}</label>
                      <select
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
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
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-900 transition-all"
                      >
                        {INCOME_RANGES.map(i => <option key={i} value={i}>{t(`IncomeRanges.${i}`)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('AvatarPreference')}</label>
                      <div className="grid grid-cols-3 gap-3">
                         {[
                           { id: 'initials', label: t('Initials'), icon: UserCircle },
                           { id: 'ai', label: t('AiAvatar'), icon: ShieldCheck },
                           { id: 'upload', label: t('Upload'), icon: User },
                         ].map((opt) => (
                           <button
                             key={opt.id}
                             type="button"
                             onClick={() => setFormData({...formData, avatarType: opt.id as any})}
                             className={`p-3 rounded-xl border-2 flex flex-col items-center space-y-1 transition-all ${
                               formData.avatarType === opt.id ? 'border-cyan-900 bg-cyan-50 text-cyan-900' : 'border-gray-100 text-gray-400'
                             }`}
                           >
                             <opt.icon className="w-5 h-5" />
                             <span className="text-[10px] font-bold">{opt.label}</span>
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl">{error}</p>}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>{t('Back')}</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-cyan-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-100 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>{t('CreateAccount')}</span>
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-medium">{t('OrContinueWith')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full py-4 bg-white border-2 border-gray-100 text-cyan-950 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>{t('ContinueWithGoogle')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
