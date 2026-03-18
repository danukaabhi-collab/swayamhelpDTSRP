import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled in the Firebase Console. Please enable it in the Authentication tab.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Failed to login. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if profile exists, if not create it
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
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            SH
          </div>
          <h2 className="text-3xl font-bold text-cyan-950">{t('LoginTitle')}</h2>
          <p className="text-gray-500 mt-2">{t('LoginSub')}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">{t('EmailAddress')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-900 outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-gray-700">{t('Password')}</label>
              <Link to="/forgot-password" className="text-xs text-cyan-900 font-bold hover:underline">{t('ForgotPassword')}</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-900 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-900 text-white py-4 rounded-xl font-bold hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-100 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{t('Login')}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">{t('Or')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-cyan-900 border-2 border-cyan-900 py-4 rounded-xl font-bold hover:bg-cyan-50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>{t('SignInWithGoogle')}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {t('NoAccount')}{' '}
            <Link to="/signup" className="text-cyan-900 font-bold hover:underline">{t('SignUp')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
