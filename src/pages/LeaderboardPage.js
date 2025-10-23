import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Award, 
  Users, 
  TrendingUp,
  Target,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [challengeLeaderboards, setChallengeLeaderboards] = useState({});
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const [globalResponse, challengesResponse] = await Promise.all([
        axios.get('/leaderboard'),
        axios.get('/challenges')
      ]);

      setGlobalLeaderboard(globalResponse.data.leaderboard);
      setChallenges(challengesResponse.data.challenges);
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChallengeLeaderboard = async (challengeId) => {
    try {
      const response = await axios.get(`/challenge-leaderboard/${challengeId}`);
      setChallengeLeaderboards(prev => ({
        ...prev,
        [challengeId]: response.data.leaderboard
      }));
    } catch (error) {
      console.error('Failed to fetch challenge leaderboard:', error);
    }
  };

  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge);
    if (!challengeLeaderboards[challenge.challenge_id]) {
      fetchChallengeLeaderboard(challenge.challenge_id);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />;
    return <span className="text-gray-600 font-semibold">#{rank}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            Leaderboards
          </h1>
          <p className="text-gray-600">
            See how you rank against other eco-warriors globally and in challenges
          </p>
        </motion.div>

        {/* Global Leaderboard */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Global Leaderboard</h2>
            <div className="flex items-center text-primary-600">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">All Time</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carbon Offset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activities
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {globalLeaderboard.map((entry, index) => (
                    <motion.tr
                      key={entry.name}
                      className={`${entry.name === user?.name ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRankIcon(index + 1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.name}
                              {entry.name === user?.name && (
                                <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{entry.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {entry.user_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                        {entry.total_points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {entry.total_carbon_offset} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.activities_count}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Challenge Leaderboards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Challenge Leaderboards</h2>
          
          {/* Challenge Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map((challenge) => (
                <button
                  key={challenge.challenge_id}
                  onClick={() => handleChallengeSelect(challenge)}
                  className={`p-4 rounded-lg border-2 transition-colors duration-200 text-left ${
                    selectedChallenge?.challenge_id === challenge.challenge_id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{challenge.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Challenge Leaderboard */}
          {selectedChallenge && (
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedChallenge.name} Leaderboard
                </h3>
                <p className="text-sm text-gray-600">{selectedChallenge.description}</p>
              </div>
              
              {challengeLeaderboards[selectedChallenge.challenge_id] ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points Earned
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activities
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {challengeLeaderboards[selectedChallenge.challenge_id].map((entry, index) => (
                        <motion.tr
                          key={entry.name}
                          className={`${entry.name === user?.name ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getRankIcon(index + 1)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-primary-600" />
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {entry.name}
                                  {entry.name === user?.name && (
                                    <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{entry.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                            {entry.points_earned}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.activities_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(entry.date_joined)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading leaderboard...</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          className="mt-8 bg-green-50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-green-900 mb-4">🏆 Climb the Leaderboard</h3>
          <ul className="space-y-2 text-green-800">
            <li>• Log activities regularly to accumulate points</li>
            <li>• Join challenges to earn bonus points</li>
            <li>• Complete high-impact activities for more carbon offset</li>
            <li>• Stay consistent with your eco-friendly habits</li>
            <li>• Share your activities to inspire others</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
