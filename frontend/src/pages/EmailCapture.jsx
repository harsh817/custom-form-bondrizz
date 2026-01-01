import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Mail, Lock, Heart } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg max-w-lg w-full p-8 md:p-12 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Enter Your Email
          </h1>
          <p className="text-gray-600 text-lg">
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
              className="bg-white border-gray-300 text-gray-900 text-lg py-6 px-4 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-testid="submit-email-button"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {loading ? 'Sending...' : 'See My Results'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <span>We respect your privacy. No spam, ever.</span>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center space-x-6 opacity-40 grayscale">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png"
            alt="UPI"
            className="h-6 object-contain"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png"
            alt="Secure"
            className="h-6 object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default EmailCapture;
