import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Mail, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="animated-gradient absolute inset-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full glass-card p-12 rounded-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-6 glow-violet">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3 gradient-text">
            Enter Your Email to See Your Results
          </h1>
          <p className="text-zinc-400 text-lg">
            Your personalized Rizz Score report is ready
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
              className="bg-zinc-900/50 border-white/10 text-white text-lg py-6 px-4 rounded-xl focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-testid="submit-email-button"
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-6 text-lg rounded-full glow-violet hover:scale-105 transition-transform"
          >
            {loading ? 'Sending...' : 'See My Results'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-zinc-500">
          <Lock className="w-4 h-4" />
          <span>We respect your privacy. No spam, ever.</span>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center space-x-6 opacity-50">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png"
            alt="UPI"
            className="h-8 object-contain"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png"
            alt="Secure"
            className="h-8 object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default EmailCapture;
