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
    <div className="min-h-screen premium-gradient-bg grain-overlay flex items-center justify-center px-4 relative">
      {/* Floating Orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="glass-effect max-w-lg w-full p-8 md:p-12 rounded-3xl premium-shadow-lg text-center relative z-10"
      >
        {/* Animated Heart Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-20 h-20 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 premium-shadow-lg icon-glow"
        >
          <Heart className="w-10 h-10 text-white fill-white" strokeWidth={2.5} />
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold gradient-text mb-3"
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
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <motion.div
                key={step.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.4,
                  x: 0
                }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 premium-shadow ${
                    isComplete
                      ? 'bg-gradient-to-br from-pink-400 to-violet-500'
                      : isActive
                      ? 'bg-gradient-to-br from-pink-300 to-violet-400'
                      : 'bg-gray-200'
                  }`}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                  ) : (
                    <StepIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
                  )}
                </div>
                <span
                  className={`transition-colors text-sm md:text-base font-medium ${
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
              className="w-2 h-2 bg-gradient-to-r from-pink-400 to-violet-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loading;
