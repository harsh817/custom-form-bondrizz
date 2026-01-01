import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, psychologicalTraps } from '../data/quizQuestions';
import { Button } from '../components/ui/button';
import { ChevronLeft, Heart } from 'lucide-react';

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

  const renderQuestion = () => {
    if (question.type === 'card') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswer(option.value)}
              data-testid={`quiz-card-${index}`}
              className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 group ${
                answers[question.id] === option.value
                  ? 'ring-4 ring-pink-500 scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={option.image}
                  alt={option.text}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
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
                    className="absolute top-4 right-4 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center"
                  >
                    <Heart className="w-5 h-5 text-white fill-white" />
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
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswer(option)}
              data-testid={`quiz-option-${index}`}
              className={`w-full p-5 rounded-2xl text-left font-medium transition-all duration-300 ${
                answers[question.id] === option
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-800 hover:bg-pink-50 hover:scale-102 shadow-md'
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
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center px-4 text-sm text-gray-600">
            <span>{question.labels[0]}</span>
            <span>{question.labels[1]}</span>
          </div>
          <div className="flex justify-between gap-2 md:gap-3">
            {question.scale.map((value, index) => (
              <motion.button
                key={value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(value)}
                data-testid={`likert-option-${value}`}
                className={`flex-1 h-16 md:h-20 rounded-2xl font-bold text-xl md:text-2xl transition-all duration-300 ${
                  answers[question.id] === value
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl scale-110'
                    : 'bg-white text-gray-800 hover:bg-pink-50 shadow-md'
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Bond Rizz
              </h1>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showTrap ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12"
          >
            <div className="text-center mb-8 md:mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              >
                {question.question}
              </motion.h2>
            </div>

            {renderQuestion()}

            {currentQuestion > 0 && (
              <div className="mt-8 text-center">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  data-testid="back-button"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
              </div>
            )}
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
          accent: 'from-rose-500 to-red-600'
        };
      case 'gold':
        return {
          bg: 'from-amber-50 to-orange-50',
          accent: 'from-amber-500 to-orange-600'
        };
      default:
        return {
          bg: 'from-blue-50 to-purple-50',
          accent: 'from-blue-500 to-purple-600'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onContinue}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`bg-gradient-to-br ${colors.bg} max-w-lg w-full p-8 md:p-12 rounded-3xl shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {trap.type === 'testimonial' && (
          <div className="text-center">
            <img
              src={trap.content.avatar}
              alt={trap.content.author}
              className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
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
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.accent} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {trap.content.stat}
            </h3>
            <p className="text-lg text-gray-600">{trap.content.subtext}</p>
          </div>
        )}

        {trap.type === 'social_proof' && (
          <div className="text-center">
            <div className={`text-6xl md:text-7xl font-bold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent mb-4`}>
              {trap.content.counter.toLocaleString()}+
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">{trap.content.text}</p>
            <p className="text-lg text-gray-600">{trap.content.subtext}</p>
          </div>
        )}

        <Button
          onClick={onContinue}
          data-testid="trap-continue-button"
          className={`w-full mt-8 bg-gradient-to-r ${colors.accent} text-white font-bold py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105`}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Quiz;
