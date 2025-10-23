import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ToolCard = ({ title, description, icon: Icon, link, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600 hover:bg-primary-200',
    secondary: 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 card-hover"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={link} className="block">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-200 ${colorClasses[color]}`}>
            <Icon className="h-8 w-8" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
