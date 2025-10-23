import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Calendar,
  Target,
  Users
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ActivityCard from '../components/ActivityCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_activities: 0,
    total_points: 0,
    total_carbon_offset: 0,
    challenges_joined: 0,
    challenge_points: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get(`/user-stats/${user.user_id}`),
        axios.get(`/user-activities/${user.user_id}`)
      ]);

      setStats(statsResponse.data);
      setActivities(activitiesResponse.data.activities);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Activities",
      value: stats.total_activities,
      icon: Target,
      color: "blue",
      change: "+12%"
    },
    {
      title: "Total Points",
      value: stats.total_points,
      icon: Award,
      color: "green",
      change: "+8%"
    },
    {
      title: "Carbon Offset",
      value: `${stats.total_carbon_offset} kg`,
      icon: TrendingUp,
      color: "purple",
      change: "+15%"
    },
    {
      title: "Challenges Joined",
      value: stats.challenges_joined,
      icon: Users,
      color: "orange",
      change: "+3"
    }
  ];

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
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Here's your environmental impact dashboard
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>

          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={activity.activity_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ActivityCard activity={activity} showUser={false} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-600 mb-4">Start your eco-friendly journey by logging your first activity!</p>
              <a
                href="/log-activity"
                className="btn-primary"
              >
                Log Your First Activity
              </a>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="/log-activity"
            className="bg-white rounded-lg shadow-md p-6 text-center card-hover"
          >
            <div className="bg-primary-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Log Activity</h3>
            <p className="text-gray-600">Record your eco-friendly actions</p>
          </a>

          <a
            href="/challenges"
            className="bg-white rounded-lg shadow-md p-6 text-center card-hover"
          >
            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Challenges</h3>
            <p className="text-gray-600">Compete with other eco-warriors</p>
          </a>

          <a
            href="/leaderboard"
            className="bg-white rounded-lg shadow-md p-6 text-center card-hover"
          >
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Leaderboard</h3>
            <p className="text-gray-600">See how you rank globally</p>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
