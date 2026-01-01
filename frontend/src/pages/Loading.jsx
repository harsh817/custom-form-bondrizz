import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Heart, Sparkles, Brain, Target, TrendingUp } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Loading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizResultId, setQuizResultId] = useState(null);

  const steps = [
    { text: 'Analyzing conversation patterns', icon: Brain },
    { text: 'Calculating confidence score', icon: TrendingUp },
    { text: 'Identifying strengths & weaknesses', icon: Target },
    { text: 'Determining your persona', icon: Sparkles },
    { text: 'Generating personalized insights', icon: Heart }
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

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    const navigateTimeout = setTimeout(() => {
      navigate('/email');
    }, 15000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(navigateTimeout);
    };
  }, [navigate, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-xl max-w-lg w-full p-8 md:p-12 rounded-3xl shadow-2xl text-center relative z-10 border border-white/20"
      >
        {/* Animated Heart Icon */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <Heart className="w-10 h-10 text-white fill-white" />
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3"
        >
          Analyzing Your Rizz Profile...
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8"
        >
          This will only take a moment
        </motion.p>

        {/* Checklist */}
        <div className="space-y-4 text-left">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: 0
                }}
                transition={{ delay: index * 0.5 }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  animate={index === currentStep ? {
                    rotate: [0, 360],
                    transition: { duration: 1, repeat: Infinity, ease: "linear" }
                  } : {}}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <StepIcon className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <span
                  className={`transition-colors text-base font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Loading dots */}
        <motion.div 
          className="flex justify-center space-x-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loading;
