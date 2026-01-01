import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Loading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizResultId, setQuizResultId] = useState(null);

  const steps = [
    'Analyzing conversation patterns',
    'Calculating confidence score',
    'Identifying strengths & weaknesses',
    'Determining your persona',
    'Generating personalized insights'
  ];

  useEffect(() => {
    const submitQuiz = async () => {
      try {
        const answersJson = sessionStorage.getItem('quizAnswers');
        if (!answersJson) {
          navigate('/');
          return;
        }

        const answersObj = JSON.parse(answersJson);
        const answersArray = Object.entries(answersObj).map(([question_id, answer]) => ({
          question_id,
          answer
        }));

        const response = await axios.post(`${API}/quiz/submit`, {
          answers: answersArray
        });

        setQuizResultId(response.data.id);
        sessionStorage.setItem('quizResultId', response.data.id);
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    };

    submitQuiz();

    // Animate through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    // Navigate after 15 seconds
    const navigateTimeout = setTimeout(() => {
      navigate('/email');
    }, 15000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(navigateTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="animated-gradient absolute inset-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-md w-full glass-card p-12 rounded-2xl text-center"
      >
        {/* Spinner */}
        <div className="flex justify-center mb-8">
          <div className="spinner" />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold mb-3 gradient-text">
          Analyzing Your Rizz Profile...
        </h1>
        <p className="text-zinc-400 mb-8">This will only take a moment</p>

        {/* Checklist */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0
              }}
              transition={{ delay: index * 0.5 }}
              className="flex items-center space-x-3 text-left"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                    : 'bg-zinc-800'
                }`}
              >
                {index <= currentStep && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
              <span
                className={`transition-colors ${
                  index <= currentStep ? 'text-white' : 'text-zinc-600'
                }`}
              >
                {step}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;
