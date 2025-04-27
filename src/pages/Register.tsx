import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar'; // Assuming Navbar is in the components folder

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth(); // Your signup function must throw error properly
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('❌ Passwords do not match!');
      return;
    }

    try {
      await signup(username, password); // Important: signup must throw errors properly
      toast.success('✅ Account created successfully, You can Login Now!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setError(err.message);
      toast.error(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <Navbar />

      <div className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Create Account</h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 text-red-200 px-4 py-2 rounded-lg mb-6 text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <UserPlus size={20} />
                Create Account
              </motion.button>
            </form>

            <p className="mt-8 text-center text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
