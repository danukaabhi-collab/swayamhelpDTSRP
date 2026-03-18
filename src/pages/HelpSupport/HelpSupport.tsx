import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, Bot, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function HelpSupport() {
  const { t } = useTranslation();
  const FAQS = t('FaqList', { returnObjects: true }) as Array<{ q: string, a: string }>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Support Info */}
        <div className="space-y-10">
          <div>
            <h1 className="text-4xl font-bold text-cyan-950 mb-4">{t('HelpSupport')}</h1>
            <p className="text-gray-600 leading-relaxed">
              {t('HelpSupportSub')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-900 to-indigo-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-cyan-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">{t('InstantAiHelp')}</h3>
              <p className="text-cyan-100 text-lg mb-8 leading-relaxed">
                {t('InstantAiHelpSub')}
              </p>
              <button 
                onClick={() => {
                  const aiBtn = document.querySelector('button[class*="bg-cyan-900"][class*="w-14"]') as HTMLButtonElement;
                  if (aiBtn) aiBtn.click();
                }}
                className="bg-white text-cyan-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cyan-50 transition-all shadow-xl flex items-center space-x-2"
              >
                <span>{t('LaunchAiAssistant')}</span>
                <Zap className="w-5 h-5 text-yellow-500" />
              </button>
            </div>
            <Bot className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
          </div>
        </div>

        {/* Right: FAQs */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3 text-cyan-900 mb-2">
            <HelpCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">{t('Faqs')}</h2>
          </div>
          <div className="space-y-4">
            {Array.isArray(FAQS) && FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-cyan-200 transition-colors"
              >
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                    <span className="font-bold text-gray-900">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
