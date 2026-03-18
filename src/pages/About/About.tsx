import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Globe, Target, Heart, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const VALUES = [
    {
      icon: ShieldCheck,
      title: t('About.Values.Trust.Title'),
      description: t('About.Values.Trust.Desc')
    },
    {
      icon: Users,
      title: t('About.Values.Citizen.Title'),
      description: t('About.Values.Citizen.Desc')
    },
    {
      icon: Globe,
      title: t('About.Values.Inclusive.Title'),
      description: t('About.Values.Inclusive.Desc')
    }
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-cyan-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              {t('About.Hero.Title')} <span className="text-cyan-400">{t('About.Hero.TitleAccent')}</span>
            </h1>
            <p className="text-xl text-cyan-100 leading-relaxed">
              {t('About.Hero.Sub')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full text-sm font-bold mb-6">
              <Target className="w-4 h-4" />
              <span>{t('About.Mission.Label')}</span>
            </div>
            <h2 className="text-4xl font-bold text-cyan-950 mb-6">{t('About.Mission.Title')}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {t('About.Mission.Desc1')}
              <br /><br />
              {t('About.Mission.Desc2')}
            </p>
            <div className="space-y-4">
              {[
                t('About.Mission.Point1'),
                t('About.Mission.Point2'),
                t('About.Mission.Point3'),
                t('About.Mission.Point4')
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-cyan-100 to-indigo-100 rounded-[3rem] overflow-hidden relative">
              <img 
                src="https://picsum.photos/seed/india-village/800/800" 
                alt="Empowering Rural India" 
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50">
                  <Heart className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-cyan-950 mb-2">{t('About.Mission.Card.Title')}</h3>
                  <p className="text-gray-600">{t('About.Mission.Card.Sub')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-cyan-950 mb-4">{t('About.Values.Title')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t('About.Values.Sub')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((value, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-cyan-50 text-cyan-900 rounded-2xl flex items-center justify-center mb-8">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-cyan-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">{t('About.CTA.Title')}</h2>
            <p className="text-cyan-100 text-xl mb-12 max-w-2xl mx-auto">{t('About.CTA.Sub')}</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="px-10 py-4 bg-white text-cyan-900 rounded-2xl font-bold text-lg hover:bg-cyan-50 transition-all shadow-xl">
                {t('About.CTA.Primary')}
              </button>
              <button className="px-10 py-4 bg-cyan-800 text-white border border-cyan-700 rounded-2xl font-bold text-lg hover:bg-cyan-700 transition-all">
                {t('About.CTA.Secondary')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
