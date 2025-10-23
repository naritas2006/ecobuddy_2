import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, X } from 'lucide-react';
import axios from 'axios';

const UploadActivityForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    category_id: '',
    description: '',
    points: '',
    carbon_offset: ''
  });
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/activity-options');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.description || !formData.points || !formData.carbon_offset) {
      alert('Please fill in all fields');
      return;
    }

    const submitData = new FormData();
    submitData.append('category_id', formData.category_id);
    submitData.append('description', formData.description);
    submitData.append('points', formData.points);
    submitData.append('carbon_offset', formData.carbon_offset);
    
    if (selectedFile) {
      submitData.append('file', selectedFile);
    }

    onSubmit(submitData);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Log New Activity</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Category
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.category_id} value={category.category_id}>
                {category.name} - {category.description}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="input-field"
            placeholder="Describe your eco-friendly activity..."
            required
          />
        </div>

        {/* Points and Carbon Offset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Earned
            </label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              className="input-field"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carbon Offset (kg CO₂)
            </label>
            <input
              type="number"
              name="carbon_offset"
              value={formData.carbon_offset}
              onChange={handleInputChange}
              className="input-field"
              placeholder="0.0"
              step="0.1"
              min="0"
              required
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Photo (Optional)
          </label>
          
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload a photo</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit Activity'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default UploadActivityForm;
