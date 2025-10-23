import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  BarChart3, 
  PlusCircle, 
  Trophy, 
  Users, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StepCard from '../components/StepCard';
import ToolCard from '../components/ToolCard';

const HomePage = () => {
  const { user } = useAuth();

  const steps = [
    {
      title: "Log Activities",
      description: "Record your eco-friendly actions like recycling, cycling, or planting trees"
    },
    {
      title: "Earn Points",
      description: "Get rewarded with points for each sustainable activity you complete"
    },
    {
      title: "Track Impact",
      description: "Monitor your carbon offset and see your environmental contribution"
    }
  ];

  const features = [
    {
      title: "Activity Tracking",
      description: "Log and monitor your eco-friendly activities",
      icon: Target,
      color: "primary"
    },
    {
      title: "Challenges",
      description: "Join community challenges and compete with others",
      icon: Trophy,
      color: "orange"
    },
    {
      title: "Leaderboards",
      description: "See how you rank against other eco-warriors",
      icon: BarChart3,
      color: "blue"
    },
    {
      title: "Community",
      description: "Connect with like-minded individuals and teams",
      icon: Users,
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <Leaf className="h-16 w-16" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-green-200">EcoBuddy</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Track your eco-friendly activities, earn points, and make a real impact on the environment. 
              Join our community of sustainability champions!
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/dashboard" 
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  to="/log-activity" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Log Activity
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start making a difference in just three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                number={index + 1}
                icon={index === 0 ? PlusCircle : index === 1 ? Trophy : CheckCircle}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to track and improve your environmental impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ToolCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                link={user ? "/dashboard" : "/register"}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already tracking their environmental impact and making the world a better place.
            </p>
            
            {!user ? (
              <Link 
                to="/register" 
                className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <Link 
                to="/log-activity" 
                className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Log Your First Activity
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
