import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCategory } from '../../utils/formatters';

interface CategoryCardProps {
  category: {
    id: string;
    title: string;
    icon: string;
  };
  onClick: (id: string) => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const { t } = useTranslation();
  const IconComponent = (Icons as any)[category.icon] || Icons.HelpCircle;

  const categoryLabel = t(`Categories.${category.id}`);
  const displayCategory = categoryLabel.includes('.') ? formatCategory(categoryLabel) : categoryLabel;

  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category.id)}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-cyan-100 transition-all group"
    >
      <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-900 group-hover:bg-cyan-900 group-hover:text-white transition-colors">
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className="text-sm font-bold text-gray-800 group-hover:text-cyan-900 transition-colors">
        {displayCategory}
      </h3>
    </motion.button>
  );
}
