import React from 'react';
import { motion } from 'framer-motion';

const StepCard = ({ step, number, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 text-center card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex justify-center mb-4">
        <div className="bg-primary-100 rounded-full p-3">
          <Icon className="h-8 w-8 text-primary-600" />
        </div>
      </div>
      
      <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-4">
        {number}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
      <p className="text-gray-600">{step.description}</p>
    </motion.div>
  );
};

export default StepCard;
