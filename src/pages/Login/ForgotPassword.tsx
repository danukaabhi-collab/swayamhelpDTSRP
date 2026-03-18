import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      console.error('Reset error:', err);
      setError(err.message || 'Failed to send reset email.');
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
        <div className="mb-8">
          <Link to="/login" className="inline-flex items-center text-sm text-cyan-900 font-bold hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('BackToLogin')}
          </Link>
          <h2 className="text-3xl font-bold text-cyan-950">{t('ForgotPasswordTitle')}</h2>
          <p className="text-gray-500 mt-2">{t('ForgotPasswordSub')}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-start space-x-3 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-900 text-white py-4 rounded-xl font-bold hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-100 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>{t('SendResetLink')}</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
