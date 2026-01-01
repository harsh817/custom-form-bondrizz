import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, psychologicalTraps } from '../data/quizQuestions';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { ChevronLeft } from 'lucide-react';

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

    // Check if we should show a trap after this question
    const trap = psychologicalTraps.find(
      (t) => t.afterQuestion === question.number
    );

    if (trap) {
      setShowTrap(trap);
      // Jump progress by 5%
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
      // Quiz completed - save answers and move to loading
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
    if (question.type === 'single') {
      return (
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[question.id] || ''}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 glass-card p-4 rounded-xl cursor-pointer hover:border-violet-500 transition-all"
              onClick={() => handleAnswer(option)}
              data-testid={`quiz-option-${index}`}
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer text-base"
              >
                {option}
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      );
    }

    if (question.type === 'likert') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm text-zinc-400">{question.labels[0]}</span>
            <span className="text-sm text-zinc-400">{question.labels[1]}</span>
          </div>
          <div className="flex justify-between gap-3">
            {question.scale.map((value, index) => (
              <motion.button
                key={value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(value)}
                data-testid={`likert-option-${value}`}
                className={`flex-1 h-16 rounded-xl font-bold text-lg transition-all ${
                  answers[question.id] === value
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 glow-violet'
                    : 'glass-card hover:border-violet-500'
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
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Animated background */}
      <div className="animated-gradient absolute inset-0 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold gradient-text">Bond Rizz</h1>
          <span className="text-zinc-400 text-sm">
            {Math.round(progress)}% Complete
          </span>
        </div>

        <Progress value={progress} className="h-2 mb-8" />
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        {!showTrap ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 max-w-2xl mx-auto px-6"
          >
            <div className="mb-8">
              <p className="text-sm text-violet-400 mb-2">
                Question {question.number} of {totalQuestions}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {question.question}
              </h2>
            </div>

            {renderQuestion()}

            {currentQuestion > 0 && (
              <Button
                variant="ghost"
                onClick={handleBack}
                data-testid="back-button"
                className="mt-6 text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
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
        return 'from-rose-500 to-red-600';
      case 'gold':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-blue-500 to-violet-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onContinue}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="glass-card max-w-md w-full p-8 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {trap.type === 'testimonial' && (
          <div className="text-center">
            <img
              src={trap.content.avatar}
              alt={trap.content.author}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-violet-500"
            />
            <p className="text-lg italic mb-4 text-white">
              "{trap.content.quote}"
            </p>
            <p className="text-sm text-violet-400 mb-6">
              - {trap.content.author}
            </p>
          </div>
        )}

        {trap.type === 'warning' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              {trap.content.stat}
            </h3>
            <p className="text-zinc-400">{trap.content.subtext}</p>
          </div>
        )}

        {trap.type === 'social_proof' && (
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text mb-2">
              {trap.content.counter.toLocaleString()}+
            </div>
            <p className="text-xl mb-2 text-white">{trap.content.text}</p>
            <p className="text-sm text-zinc-400">{trap.content.subtext}</p>
          </div>
        )}

        <Button
          onClick={onContinue}
          data-testid="trap-continue-button"
          className={`w-full mt-6 bg-gradient-to-r ${getThemeColors()} text-white font-bold py-4 rounded-full glow-violet`}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Quiz;
