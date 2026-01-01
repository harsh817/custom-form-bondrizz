import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from '../hooks/useWindowSize';
import { Button } from '../components/ui/button';
import { Check, Mail, BookOpen, Users } from 'lucide-react';

const Success = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = React.useState(true);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const nextSteps = [
    {
      icon: Mail,
      title: 'Check Your Email',
      description: 'Your purchase confirmation and access details have been sent'
    },
    {
      icon: Users,
      title: 'Join the Community',
      description: 'Connect with 1000+ members in our private Discord'
    },
    {
      icon: BookOpen,
      title: 'Start Learning',
      description: 'Access your first lesson and begin your transformation'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          colors={['#8B5CF6', '#D946EF', '#10B981', '#F59E0B']}
        />
      )}

      {/* Animated background */}
      <div className="animated-gradient absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-8 shadow-2xl"
        >
          <Check className="w-16 h-16 text-white" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-white mb-4 text-center"
        >
          Welcome to Bond Rizz!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-zinc-400 mb-12 text-center"
        >
          Your journey to dating mastery starts now
        </motion.p>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-4 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What Happens Next?
          </h2>
          {nextSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass-card p-6 rounded-2xl flex items-start space-x-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full text-center"
        >
          <Button
            data-testid="access-dashboard-button"
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-6 px-12 text-lg rounded-full glow-violet hover:scale-105 transition-transform"
          >
            Access Your Dashboard
          </Button>
          <p className="text-sm text-zinc-500 mt-4">
            You can also access your account from the link in your email
          </p>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-zinc-500 text-sm"
        >
          <p>Need help? Contact us at support@bondrizzz.com</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;
