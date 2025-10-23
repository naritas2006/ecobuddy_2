import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Award, Image as ImageIcon } from 'lucide-react';

const ActivityCard = ({ activity, showUser = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activity.category_name}
          </h3>
          <p className="text-gray-600 mb-3">{activity.description}</p>
          
          {showUser && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="font-medium">{activity.user_name}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(activity.date_time)}
          </div>
        </div>
        
        {activity.image_data && (
          <div className="ml-4">
            <img
              src={`data:${activity.image_content_type};base64,${activity.image_data}`}
              alt="Activity"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-primary-600">
            <Award className="h-4 w-4 mr-1" />
            <span className="font-semibold">{activity.points} pts</span>
          </div>
          <div className="flex items-center text-green-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="font-semibold">{activity.carbon_offset} kg CO₂</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
