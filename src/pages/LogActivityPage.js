import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import UploadActivityForm from '../components/UploadActivityForm';

const LogActivityPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/upload-activity', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Activity logged successfully! 🎉');
      
      // Reset form after successful submission
      setTimeout(() => {
        setMessage('');
        // You could also redirect to dashboard or refresh the form
      }, 3000);

    } catch (error) {
      console.error('Failed to submit activity:', error);
      setError(error.response?.data?.detail || 'Failed to submit activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Log Your Eco-Friendly Activity
          </h1>
          <p className="text-gray-600">
            Share your sustainable actions and earn points for making a difference
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        {message && (
          <motion.div
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{message}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <UploadActivityForm onSubmit={handleSubmit} loading={loading} />

        {/* Tips Section */}
        <motion.div
          className="mt-8 bg-blue-50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for Better Activities</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Be specific about what you did and how it helps the environment</li>
            <li>• Include photos to make your activity more engaging</li>
            <li>• Use accurate carbon offset calculations based on your activity</li>
            <li>• Join challenges to earn bonus points and compete with others</li>
            <li>• Share your activities to inspire others in the community</li>
          </ul>
        </motion.div>

        {/* Activity Ideas */}
        <motion.div
          className="mt-8 bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌱 Activity Ideas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Recycling & Waste Reduction</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recycled plastic bottles</li>
                <li>• Composted food waste</li>
                <li>• Used reusable shopping bags</li>
                <li>• Reduced single-use plastics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Transportation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cycled to work/school</li>
                <li>• Used public transportation</li>
                <li>• Walked instead of driving</li>
                <li>• Carpooled with others</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Energy Conservation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Turned off lights when not needed</li>
                <li>• Used energy-efficient appliances</li>
                <li>• Reduced heating/cooling usage</li>
                <li>• Used natural lighting</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Nature & Green Spaces</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Planted trees or flowers</li>
                <li>• Participated in community cleanups</li>
                <li>• Started a garden</li>
                <li>• Protected local wildlife</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LogActivityPage;
