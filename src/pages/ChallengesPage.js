import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Award, 
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ChallengesPage = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);

  useEffect(() => {
    fetchChallenges();
    fetchUserChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/challenges');
      setChallenges(response.data.challenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    }
  };

  const fetchUserChallenges = async () => {
    try {
      const response = await axios.get(`/user-challenges/${user.user_id}`);
      setUserChallenges(response.data.challenges);
    } catch (error) {
      console.error('Failed to fetch user challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId) => {
    setJoining(challengeId);
    try {
      await axios.post('/join-challenge', { challenge_id: challengeId });
      await fetchUserChallenges(); // Refresh user challenges
      alert('Successfully joined the challenge! 🎉');
    } catch (error) {
      console.error('Failed to join challenge:', error);
      alert(error.response?.data?.detail || 'Failed to join challenge');
    } finally {
      setJoining(null);
    }
  };

  const isJoined = (challengeId) => {
    return userChallenges.some(uc => uc.challenge_id === challengeId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Eco Challenges
          </h1>
          <p className="text-gray-600">
            Join community challenges and compete with other eco-warriors
          </p>
        </motion.div>

        {/* My Challenges */}
        {userChallenges.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.challenge_id}
                  className="bg-white rounded-lg shadow-md p-6 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {challenge.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {challenge.description}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      challenge.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {challenge.status}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {getDaysRemaining(challenge.end_date)} days remaining
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      {challenge.reward_points} reward points
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Joined: {formatDate(challenge.date_joined)}
                    </div>
                    <div className="text-sm font-semibold text-primary-600">
                      {challenge.points_earned} pts earned
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Available Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => {
              const joined = isJoined(challenge.challenge_id);
              const daysRemaining = getDaysRemaining(challenge.end_date);
              
              return (
                <motion.div
                  key={challenge.challenge_id}
                  className="bg-white rounded-lg shadow-md p-6 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {challenge.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {challenge.participant_count}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {daysRemaining} days remaining
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      {challenge.reward_points} reward points
                    </div>
                  </div>

                  <button
                    onClick={() => joinChallenge(challenge.challenge_id)}
                    disabled={joined || joining === challenge.challenge_id || daysRemaining === 0}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      joined
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : daysRemaining === 0
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {joined ? (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Joined
                      </div>
                    ) : joining === challenge.challenge_id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Joining...
                      </div>
                    ) : daysRemaining === 0 ? (
                      'Challenge Ended'
                    ) : (
                      <div className="flex items-center justify-center">
                        <Target className="h-4 w-4 mr-2" />
                        Join Challenge
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Challenge Tips */}
        <motion.div
          className="mt-8 bg-blue-50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🏆 Challenge Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Complete daily activities to maximize your points</li>
            <li>• Share your progress with the community</li>
            <li>• Join multiple challenges to increase your impact</li>
            <li>• Check the leaderboard regularly to track your progress</li>
            <li>• Invite friends to join challenges for team competitions</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ChallengesPage;
