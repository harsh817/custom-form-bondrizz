import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, psychologicalTraps } from '../data/quizQuestions';
import { Button } from '../components/ui/button';
import { ChevronLeft, Heart, Sparkles, MessageCircle, Target, TrendingUp } from 'lucide-react';

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
    return <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />;
  };

  const renderQuestion = () => {
    if (question.type === 'card') {
      return (
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.08,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option.value)}
              data-testid={`quiz-card-${index}`}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                answers[question.id] === option.value
                  ? 'ring-2 ring-pink-400 shadow-xl'
                  : 'shadow-md hover:shadow-lg'
              }`}
            >
              <div className="aspect-[3/2] relative">
                <img
                  src={option.image}
                  alt={option.text}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                  <h3 className="text-base md:text-lg font-bold mb-0.5">{option.text}</h3>
                  {option.subtext && (
                    <p className="text-xs md:text-sm text-white/80">{option.subtext}</p>
                  )}
                </div>
                {answers[question.id] === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Heart className="w-4 h-4 text-white fill-white" />
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                x: 2,
                transition: { duration: 0.15 }
              }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleAnswer(option)}
              data-testid={`quiz-option-${index}`}
              className={`w-full p-4 md:p-5 rounded-2xl text-left text-base md:text-lg font-semibold transition-all duration-200 relative ${
                answers[question.id] === option
                  ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg ring-2 ring-pink-300'
                  : 'bg-white text-gray-800 hover:bg-pink-50 hover:text-pink-600 shadow-sm hover:shadow-md'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      );
    }

    if (question.type === 'likert') {
      return (
        <div className="space-y-5 max-w-2xl mx-auto">
          <div className="flex justify-between items-center px-2 text-xs md:text-sm text-gray-500 font-medium">
            <span>{question.labels[0]}</span>
            <span>{question.labels[1]}</span>
          </div>
          <div className="flex justify-between gap-2 md:gap-3">
            {question.scale.map((value, index) => (
              <motion.button
                key={value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.06,
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.15 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(value)}
                data-testid={`likert-option-${value}`}
                className={`flex-1 h-14 md:h-16 rounded-xl font-bold text-lg md:text-xl transition-all duration-200 ${
                  answers[question.id] === value
                    ? 'bg-gradient-to-br from-pink-500 to-violet-600 text-white shadow-lg ring-2 ring-pink-300'
                    : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-sm hover:shadow-md'
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
    <div className="min-h-screen premium-gradient-bg grain-overlay relative">
      {/* Floating Orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      {/* Header */}
      <div className="glass-effect border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between mb-3">
            <motion.div 
              className="flex items-center space-x-2 md:space-x-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center shadow-md icon-glow">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-lg md:text-xl font-bold gradient-text">
                Bond Rizz
              </h1>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs md:text-sm font-semibold text-gray-600 bg-white/60 px-3 py-1.5 rounded-full shadow-sm"
            >
              {currentQuestion + 1}/{totalQuestions}
            </motion.span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 via-violet-400 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        {!showTrap ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col justify-center"
            style={{ minHeight: 'calc(100vh - 120px)' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-6">
              <div className="text-center mb-6 md:mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-pink-400 to-violet-500 rounded-2xl mb-4 shadow-lg icon-glow"
                >
                  {getQuestionIcon()}
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight px-4"
                >
                  {question.question}
                </motion.h2>
              </div>

              {renderQuestion()}

              {currentQuestion > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-center"
                >
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    data-testid="back-button"
                    className="text-gray-500 hover:text-gray-800 hover:bg-white/50"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
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
          accent: 'from-rose-400 to-red-500',
          ring: 'ring-rose-200'
        };
      case 'gold':
        return {
          bg: 'from-amber-50 to-orange-50',
          accent: 'from-amber-400 to-orange-500',
          ring: 'ring-amber-200'
        };
      default:
        return {
          bg: 'from-blue-50 to-indigo-50',
          accent: 'from-blue-400 to-indigo-500',
          ring: 'ring-blue-200'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onContinue}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`bg-gradient-to-br ${colors.bg} max-w-lg w-full p-8 md:p-10 rounded-3xl shadow-2xl ring-2 ${colors.ring}`}
        onClick={(e) => e.stopPropagation()}
      >
        {trap.type === 'testimonial' && (
          <div className="text-center">
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              src={trap.content.avatar}
              alt={trap.content.author}
              className="w-20 h-20 rounded-full mx-auto mb-6 border-3 border-white shadow-xl"
            />
            <p className="text-xl md:text-2xl font-medium text-gray-800 mb-4 leading-relaxed">
              "{trap.content.quote}"
            </p>
            <p className={`text-lg font-bold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
              - {trap.content.author}
            </p>
          </div>
        )}

        {trap.type === 'warning' && (
          <div className="text-center">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.accent} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {trap.content.stat}
            </h3>
            <p className="text-lg text-gray-600">{trap.content.subtext}</p>
          </div>
        )}

        {trap.type === 'social_proof' && (
          <div className="text-center">
            <div className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent mb-4`}>
              {trap.content.counter.toLocaleString()}+
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{trap.content.text}</p>
            <p className="text-base text-gray-600">{trap.content.subtext}</p>
          </div>
        )}

        <Button
          onClick={onContinue}
          data-testid="trap-continue-button"
          className={`w-full mt-8 bg-gradient-to-r ${colors.accent} text-white font-bold py-4 text-base rounded-full shadow-md hover:shadow-lg transition-all magnetic-hover`}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Quiz;
