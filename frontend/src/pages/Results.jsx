import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Check, X, AlertCircle, Star, Shield, Clock, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Results = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hasOrderBump, setHasOrderBump] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      const resultId = searchParams.get('id') || sessionStorage.getItem('quizResultId');
      if (!resultId) {
        toast.error('No quiz results found');
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`${API}/quiz/result/${resultId}`);
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load results');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [searchParams, navigate]);

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSubmit = async () => {
    const email = sessionStorage.getItem('userEmail');
    if (!email) {
      toast.error('Email not found. Please go back and enter your email.');
      return;
    }

    try {
      const totalAmount = selectedPlan.price + (hasOrderBump ? 199 : 0);
      
      const orderResponse = await axios.post(`${API}/order/create`, {
        email,
        quiz_result_id: result.id,
        plan: selectedPlan.name,
        amount: totalAmount,
        has_order_bump: hasOrderBump
      });

      // Mock payment success
      await axios.post(`${API}/order/complete/${orderResponse.data.id}`);

      toast.success('Payment successful!');
      navigate('/success');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const getPersonaColor = () => {
    if (result.score <= 40) return 'from-rose-500 to-red-600';
    if (result.score <= 65) return 'from-amber-500 to-orange-600';
    return 'from-yellow-500 to-amber-600';
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Animated background */}
      <div className="animated-gradient absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header - Rizz Score Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-3xl mb-8 text-center"
        >
          <div className="relative w-48 h-48 mx-auto mb-6">
            {/* Circular gauge */}
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#18181B"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(result.score / 100) * 552} 552`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text font-mono">
                  {result.score}
                </div>
                <div className="text-sm text-zinc-400">/ 100</div>
              </div>
            </div>
          </div>

          <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${getPersonaColor()} mb-4`}>
            <span className="text-white font-bold">{result.persona_description}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {result.headline}
          </h1>
        </motion.div>

        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-2xl mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            What You're Doing Right
          </h2>
          <div className="space-y-3">
            {result.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{strength}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 rounded-2xl mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center mr-3">
              <X className="w-6 h-6 text-rose-500" />
            </div>
            What's Holding You Back
          </h2>
          <div className="space-y-3">
            {result.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start space-x-3">
                <X className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{weakness}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 rounded-2xl mb-8 border-2 border-rose-500/30"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <AlertCircle className="w-6 h-6 text-rose-500 mr-3" />
            The Problem
          </h2>
          <p className="text-zinc-300 leading-relaxed">{result.problem_description}</p>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 rounded-2xl mb-8 border-2 border-violet-500/30"
        >
          <h2 className="text-3xl font-bold text-white mb-6">How to Fix This</h2>
          <p className="text-zinc-300 text-lg leading-relaxed mb-6">
            The Bond Rizz Program is a comprehensive 30-day transformation system designed to turn you from invisible to irresistible. You'll learn:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'The psychology of attraction over text',
              'Proven conversation frameworks that work',
              'How to create emotional connection instantly',
              'Flirting techniques that build tension',
              'When to escalate and ask for the date',
              'Handling objections and maintaining interest'
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Basic"
              duration="1 Month"
              price={999}
              originalPrice={1999}
              features={[
                'Core messaging frameworks',
                'Basic flirting techniques',
                '30 days of access',
                'Email support'
              ]}
              onSelect={() => handlePurchase({ name: 'Basic', price: 999, duration: '1 Month' })}
            />
            <PricingCard
              name="Popular"
              duration="3 Months"
              price={1799}
              originalPrice={3999}
              features={[
                'Everything in Basic',
                'Advanced attraction principles',
                'Live Q&A sessions',
                '90 days of access',
                'Priority support',
                'Community access'
              ]}
              recommended
              onSelect={() => handlePurchase({ name: 'Popular', price: 1799, duration: '3 Months' })}
            />
            <PricingCard
              name="Pro"
              duration="6 Months"
              price={2999}
              originalPrice={5999}
              features={[
                'Everything in Popular',
                'One-on-one coaching calls',
                'Custom profile optimization',
                '180 days of access',
                'VIP support',
                'Lifetime community access'
              ]}
              onSelect={() => handlePurchase({ name: 'Pro', price: 2999, duration: '6 Months' })}
            />
          </div>
        </motion.div>

        {/* Order Bump */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 rounded-2xl mb-8 border-2 border-amber-500/50 bg-amber-500/5"
        >
          <div className="flex items-start space-x-4">
            <input
              type="checkbox"
              id="order-bump"
              checked={hasOrderBump}
              onChange={(e) => setHasOrderBump(e.target.checked)}
              data-testid="order-bump-checkbox"
              className="mt-1 w-5 h-5 rounded border-amber-500 text-amber-500 focus:ring-amber-500"
            />
            <div className="flex-1">
              <label htmlFor="order-bump" className="cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-lg font-bold text-white">
                    Add the "Message Templates" Bonus Pack
                  </span>
                  <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                    ONE-TIME OFFER
                  </span>
                </div>
                <p className="text-zinc-300 mb-2">
                  Get 50+ proven message templates that work across all dating apps. Never run out of things to say again.
                </p>
                <p className="text-2xl font-bold gradient-text">
                  Only ₹199 <span className="text-lg text-zinc-500 line-through">₹999</span>
                </p>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Arjun S.',
                age: 27,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
                quote: 'Went from 0 dates to 3 dates a week. My matches actually respond now!',
                stat: '3x more dates'
              },
              {
                name: 'Vikram K.',
                age: 24,
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
                quote: 'Finally found a girlfriend. These strategies actually work.',
                stat: 'In a relationship'
              },
              {
                name: 'Rohan M.',
                age: 29,
                image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
                quote: 'My confidence is through the roof. I know exactly what to say now.',
                stat: '10+ matches weekly'
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-violet-500"
                  />
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-zinc-400">{testimonial.age} years old</div>
                  </div>
                </div>
                <p className="text-zinc-300 mb-4 italic">"{testimonial.quote}"</p>
                <div className="text-sm font-bold gradient-text">{testimonial.stat}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-8 rounded-2xl mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: 'How quickly will I see results?',
                answer: 'Most students see improvements within the first week. You\'ll notice more engaging conversations and better response rates almost immediately as you implement the frameworks.'
              },
              {
                question: 'What if I\'m completely new to dating apps?',
                answer: 'Perfect! The program starts from the basics and builds up. We cover everything from profile optimization to advanced conversation techniques.'
              },
              {
                question: 'Is there a money-back guarantee?',
                answer: 'Yes! If you complete the program and don\'t see any improvement in your dating life within 30 days, we\'ll refund your money. No questions asked.'
              },
              {
                question: 'How is this different from other dating advice?',
                answer: 'We focus specifically on the psychology of text-based attraction. Every technique is backed by behavioral science and tested with real users.'
              },
              {
                question: 'Will this work on all dating apps?',
                answer: 'Absolutely! The principles work across Tinder, Bumble, Hinge, Instagram DMs, and any text-based communication platform.'
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                <AccordionTrigger className="text-white hover:text-violet-400 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-6 rounded-2xl mb-8"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div className="font-bold text-white mb-1">30-Day Guarantee</div>
              <div className="text-sm text-zinc-400">
                Full refund if not satisfied
              </div>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="font-bold text-white mb-1">Instant Access</div>
              <div className="text-sm text-zinc-400">
                Start learning immediately
              </div>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-violet-500" />
              </div>
              <div className="font-bold text-white mb-1">Proven Results</div>
              <div className="text-sm text-zinc-400">
                1000+ success stories
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center glass-card p-8 rounded-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Dating Life?
          </h2>
          <p className="text-zinc-400 mb-6">
            Join 1000+ men who have already leveled up their texting game
          </p>
          <p className="text-sm text-amber-500 mb-6">
            ⚡ Limited Time: 50% Off All Plans
          </p>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">
              Complete Your Purchase
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Plan:</span>
                <span className="font-bold">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Duration:</span>
                <span className="font-bold">{selectedPlan?.duration}</span>
              </div>
              {hasOrderBump && (
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400">Message Templates:</span>
                  <span className="font-bold">₹199</span>
                </div>
              )}
              <div className="border-t border-white/10 mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-bold gradient-text">
                    ₹{(selectedPlan?.price || 0) + (hasOrderBump ? 199 : 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
              <p className="text-sm text-amber-200 text-center">
                🎉 Mock Payment Mode - Click below to simulate successful payment
              </p>
            </div>

            <Button
              onClick={handlePaymentSubmit}
              data-testid="confirm-payment-button"
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-6 text-lg rounded-full glow-violet"
            >
              Confirm Payment (Mock)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PricingCard = ({ name, duration, price, originalPrice, features, recommended, onSelect }) => {
  return (
    <div
      className={`glass-card p-8 rounded-2xl relative ${
        recommended ? 'border-2 border-violet-500' : ''
      }`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2 rounded-full text-white font-bold text-sm">
            MOST POPULAR
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-zinc-400 mb-4">{duration}</p>
        <div className="mb-2">
          <span className="text-4xl font-bold gradient-text">₹{price}</span>
        </div>
        <div className="text-zinc-500 line-through">₹{originalPrice}</div>
      </div>
      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-zinc-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>
      <Button
        onClick={onSelect}
        data-testid={`buy-${name.toLowerCase()}-button`}
        className={`w-full font-bold py-6 rounded-full transition-all ${
          recommended
            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white glow-violet hover:scale-105'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        Get Started
      </Button>
    </div>
  );
};

export default Results;
