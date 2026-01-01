import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, psychologicalTraps } from '../data/quizQuestions';
import { Button } from '../components/ui/button';
import { ChevronLeft, Heart, Sparkles, TrendingUp, MessageCircle, Target } from 'lucide-react';

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showTrap, setShowTrap] = useState(null);
  const [progress, setProgress] = useState(0);

  const question = quizQuestions[currentQuestion];
  const totalQuestions = quizQuestions.length;

  useEffect(() => {
    setProgress((currentQuestion / totalQuestions) * 100);
  }, [currentQuestion, totalQuestions]);

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    const trap = psychologicalTraps.find(
      (t) => t.afterQuestion === question.number
    );

    if (trap) {
      setShowTrap(trap);
      setProgress((prev) => Math.min(prev + 5, 100));
    } else {
      moveToNext();
    }
  };

  const handleTrapContinue = () => {
    setShowTrap(null);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
      navigate('/loading');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getQuestionIcon = () => {
    const icons = [Heart, Sparkles, MessageCircle, Target, TrendingUp];
    const IconComponent = icons[currentQuestion % icons.length];
    return <IconComponent className="w-6 h-6" />;
  };

  const renderQuestion = () => {
    if (question.type === 'card') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option.value)}
              data-testid={`quiz-card-${index}`}
              className={`relative overflow-hidden rounded-3xl cursor-pointer group ${
                answers[question.id] === option.value
                  ? 'ring-4 ring-pink-500 shadow-2xl'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={option.image}
                  alt={option.text}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-1">{option.text}</h3>
                  {option.subtext && (
                    <p className="text-sm md:text-base text-white/80">{option.subtext}</p>
                  )}
                </div>
                {answers[question.id] === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute top-4 right-4 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    if (question.type === 'simple') {
      return (
        <div className="space-y-3 max-w-2xl mx-auto">
          {question.options.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.08,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              whileHover={{ 
                scale: 1.02,
                x: 4,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
              data-testid={`quiz-option-${index}`}
              className={`w-full p-5 md:p-6 rounded-3xl text-left text-base md:text-lg font-semibold transition-all duration-300 relative overflow-hidden ${
                answers[question.id] === option
                  ? 'bg-gradient-to-r from-pink-600 to-purple-700 text-white shadow-xl ring-4 ring-pink-300'
                  : 'bg-white text-gray-800 hover:bg-pink-400 hover:text-white shadow-md'
              }`}
            >
              <span className="relative z-10">{option}</span>
              {answers[question.id] === option && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      );
    }

    if (question.type === 'likert') {
      return (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center px-4 text-xs md:text-sm text-gray-600 font-medium">
            <span>{question.labels[0]}</span>
            <span>{question.labels[1]}</span>
          </div>
          <div className="flex justify-between gap-2 md:gap-3">
            {question.scale.map((value, index) => (
              <motion.button
                key={value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 400,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(value)}
                data-testid={`likert-option-${value}`}
                className={`flex-1 h-16 md:h-20 rounded-2xl font-bold text-lg md:text-2xl transition-all duration-300 ${
                  answers[question.id] === value
                    ? 'bg-gradient-to-br from-pink-600 to-purple-700 text-white shadow-2xl ring-4 ring-pink-300'
                    : 'bg-white text-gray-800 hover:bg-pink-400 hover:text-white shadow-md'
                }`}
              >
                {value}
              </motion.button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Heart className="w-6 h-6 text-white fill-white" />
              </motion.div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Bond Rizz
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="hidden sm:block text-sm text-gray-500">
                Question
              </div>
              <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                {currentQuestion + 1}/{totalQuestions}
              </span>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden progress-shimmer">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Question Content - No Scroll Design */}
      <AnimatePresence mode="wait">
        {!showTrap ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 h-[calc(100vh-140px)] flex flex-col justify-center"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
              <div className="text-center mb-8 md:mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4 shadow-lg icon-pulse"
                >
                  {getQuestionIcon()}
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight px-4"
                >
                  {question.question}
                </motion.h2>
              </div>

              {renderQuestion()}

              {currentQuestion > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 text-center"
                >
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    data-testid="back-button"
                    className="text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <PsychologicalTrap trap={showTrap} onContinue={handleTrapContinue} />
        )}
      </AnimatePresence>
    </div>
  );
};

const PsychologicalTrap = ({ trap, onContinue }) => {
  const getThemeColors = () => {
    switch (trap.theme) {
      case 'red':
        return {
          bg: 'from-rose-50 to-red-50',
          accent: 'from-rose-500 to-red-600',
          ring: 'ring-rose-300'
        };
      case 'gold':
        return {
          bg: 'from-amber-50 to-orange-50',
          accent: 'from-amber-500 to-orange-600',
          ring: 'ring-amber-300'
        };
      default:
        return {
          bg: 'from-blue-50 to-purple-50',
          accent: 'from-blue-500 to-purple-600',
          ring: 'ring-blue-300'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onContinue}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`bg-gradient-to-br ${colors.bg} max-w-lg w-full p-8 md:p-12 rounded-3xl shadow-2xl border-4 ${colors.ring}`}
        onClick={(e) => e.stopPropagation()}
      >
        {trap.type === 'testimonial' && (
          <div className="text-center">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              src={trap.content.avatar}
              alt={trap.content.author}
              className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-xl"
            />
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl font-medium text-gray-800 mb-4 leading-relaxed"
            >
              "{trap.content.quote}"
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-lg font-bold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}
            >
              - {trap.content.author}
            </motion.p>
          </div>
        )}

        {trap.type === 'warning' && (
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.accent} flex items-center justify-center mx-auto mb-6 shadow-xl`}
            >
              <span className="text-4xl">⚠️</span>
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight"
            >
              {trap.content.stat}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600"
            >
              {trap.content.subtext}
            </motion.p>
          </div>
        )}

        {trap.type === 'social_proof' && (
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className={`text-6xl md:text-7xl font-bold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent mb-4`}
            >
              {trap.content.counter.toLocaleString()}+
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold text-gray-900 mb-2"
            >
              {trap.content.text}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600"
            >
              {trap.content.subtext}
            </motion.p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onContinue}
            data-testid="trap-continue-button"
            className={`w-full mt-8 bg-gradient-to-r ${colors.accent} text-white font-bold py-4 text-lg rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95`}
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Quiz;
