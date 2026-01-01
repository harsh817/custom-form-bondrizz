import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Mail, Lock, Heart, Shield, Zap } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EmailCapture = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const quizResultId = sessionStorage.getItem('quizResultId');
    if (!quizResultId) {
      toast.error('Quiz result not found. Please retake the quiz.');
      navigate('/');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/email/capture`, {
        email,
        quiz_result_id: quizResultId
      });

      sessionStorage.setItem('userEmail', email);
      toast.success('Results sent to your email!');
      navigate(`/results?id=${quizResultId}`);
    } catch (error) {
      console.error('Error capturing email:', error);
      toast.error('Failed to send results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen premium-gradient-bg grain-overlay flex items-center justify-center px-4 relative">
      {/* Floating Orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="glass-effect max-w-lg w-full p-8 md:p-12 rounded-3xl premium-shadow-lg relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="w-20 h-20 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 premium-shadow-lg icon-glow"
          >
            <Mail className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold gradient-text mb-3"
          >
            Enter Your Email
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-base md:text-lg"
          >
            Your personalized Rizz Score report is ready
          </motion.p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit} 
          className="space-y-6"
        >
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
              className="glass-effect text-gray-900 text-base md:text-lg py-5 pl-12 pr-4 rounded-2xl border-0 focus:ring-2 focus:ring-pink-400 transition-all premium-shadow"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-testid="submit-email-button"
            className="w-full bg-gradient-to-r from-pink-400 to-violet-500 text-white font-bold py-5 text-base md:text-lg rounded-full premium-shadow-lg hover:shadow-xl transition-all magnetic-hover disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" strokeWidth={2.5} />
                See My Results
              </span>
            )}
          </Button>
        </motion.form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-4"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>We respect your privacy. No spam, ever.</span>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500 glass-effect px-3 py-2 rounded-full premium-shadow">
              <Shield className="w-4 h-4 text-green-500" strokeWidth={2.5} />
              <span className="font-medium">Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 glass-effect px-3 py-2 rounded-full premium-shadow">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" strokeWidth={2.5} />
              <span className="font-medium">Trusted</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmailCapture;
