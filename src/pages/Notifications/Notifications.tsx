import React from 'react';
import { Bell, ArrowLeft, Clock, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Notifications() {
  const { t } = useTranslation();

  const notifications = [
    {
      id: 1,
      title: 'Application Under Review',
      message: 'Your application for PM-Kisan is currently being reviewed by the department.',
      time: '2 hours ago',
      type: 'info',
      icon: Clock
    },
    {
      id: 2,
      title: 'New Scheme Alert',
      message: 'A new scheme for small business owners has been launched in your state.',
      time: '1 day ago',
      type: 'success',
      icon: Bell
    },
    {
      id: 3,
      title: 'Profile Updated',
      message: 'Your profile information was successfully updated.',
      time: '3 days ago',
      type: 'success',
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-cyan-900 transition-all">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-cyan-950">{t('Notifications')}</h1>
          </div>
          <button className="text-cyan-900 font-bold hover:underline">{t('MarkAllRead')}</button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4"
            >
              <div className={`p-3 rounded-2xl ${
                notif.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <notif.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900">{notif.title}</h3>
                  <span className="text-xs text-gray-400 font-medium">{notif.time}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{notif.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
