export const quizQuestions = [
  {
    id: 'q1',
    number: 1,
    question: "What's your biggest struggle with dating apps?",
    type: 'card',
    options: [
      {
        text: "Matches seem boring",
        subtext: "Don't lead anywhere",
        image: "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=400&h=300&fit=crop",
        value: "Matches seem boring / don't lead anywhere"
      },
      {
        text: "I overthink",
        subtext: "Every message",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        value: "I overthink every message"
      },
      {
        text: "Rarely get replies",
        subtext: "Low response rate",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=300&fit=crop",
        value: "I rarely get replies"
      },
      {
        text: "Can't convert",
        subtext: "To actual dates",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop",
        value: "I get matches but can't convert to dates"
      }
    ]
  },
  {
    id: 'q2',
    number: 2,
    question: "Which platform do you use most?",
    type: 'card',
    options: [
      {
        text: "Tinder",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop",
        value: "Tinder"
      },
      {
        text: "Bumble",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        value: "Bumble"
      },
      {
        text: "Hinge",
        image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&h=300&fit=crop",
        value: "Hinge"
      },
      {
        text: "Instagram DMs",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
        value: "Instagram DMs"
      }
    ]
  },
  {
    id: 'q3',
    number: 3,
    question: "How often do you message matches?",
    type: 'card',
    options: [
      {
        text: "Daily",
        subtext: "Very active",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
        value: 'Daily'
      },
      {
        text: "Few times a week",
        subtext: "Moderately active",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
        value: 'Few times a week'
      },
      {
        text: "Rarely",
        subtext: "Not very active",
        image: "https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=400&h=300&fit=crop",
        value: 'Rarely'
      },
      {
        text: "Wait for them",
        subtext: "To message first",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop",
        value: 'I wait for them to message first'
      }
    ]
  },
  {
    id: 'q4',
    number: 4,
    question: "What are you looking for?",
    type: 'card',
    options: [
      {
        text: "Committed relationship",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop",
        value: 'Serious relationship'
      },
      {
        text: "Casual dating and fun",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        value: 'Casual dating'
      },
      {
        text: "Just hooking up",
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
        value: 'Just hooking up'
      },
      {
        text: "Still figuring it out",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop",
        value: 'Not sure yet'
      }
    ]
  },
  {
    id: 'q5',
    number: 5,
    question: 'Do you feel like you\'re "talking to a robot"?',
    type: 'simple',
    options: ['Yes, all the time', 'Sometimes', 'Rarely', 'Never']
  },
  {
    id: 'q6',
    number: 6,
    question: "What's your current messaging strategy?",
    type: 'simple',
    options: [
      'Copy-paste openers',
      'Personalized messages',
      'Wait for them to start',
      'Wing it randomly'
    ]
  },
  {
    id: 'q7',
    number: 7,
    question: 'How would friends describe your personality?',
    type: 'simple',
    options: [
      'Shy / Reserved',
      'Confident / Outgoing',
      'Funny / Sarcastic',
      'Mysterious / Quiet'
    ]
  },
  {
    id: 'q8',
    number: 8,
    question: 'Your age range?',
    type: 'simple',
    options: ['18–24', '25–30', '31–35', '36+']
  },
  {
    id: 'q9',
    number: 9,
    question: '"I\'m confident in my texting skills"',
    type: 'likert',
    scale: [1, 2, 3, 4, 5],
    labels: ['Completely Disagree', 'Completely Agree']
  },
  {
    id: 'q10',
    number: 10,
    question: '"I know how to flirt over text"',
    type: 'likert',
    scale: [1, 2, 3, 4, 5],
    labels: ['Completely Disagree', 'Completely Agree']
  },
  {
    id: 'q11',
    number: 11,
    question: '"I can tell when someone\'s interested in me"',
    type: 'likert',
    scale: [1, 2, 3, 4, 5],
    labels: ['Completely Disagree', 'Completely Agree']
  },
  {
    id: 'q12',
    number: 12,
    question: 'How do you handle rejection?',
    type: 'simple',
    options: [
      'Take it personally',
      'Learn from it',
      'Don\'t care much',
      'Avoid putting myself out there'
    ]
  },
  {
    id: 'q13',
    number: 13,
    question: 'Average time to reply to a match?',
    type: 'simple',
    options: ['Within 5 minutes', 'Within 1 hour', 'Few hours', 'Next day+']
  },
  {
    id: 'q14',
    number: 14,
    question: 'How many dating apps do you use?',
    type: 'simple',
    options: ['1', '2–3', '4–5', '6+']
  },
  {
    id: 'q15',
    number: 15,
    question: 'Preferred communication style?',
    type: 'simple',
    options: [
      'Direct and clear',
      'Playful and teasing',
      'Deep conversations',
      'Short and casual'
    ]
  },
  {
    id: 'q16',
    number: 16,
    question: 'Your location?',
    type: 'simple',
    options: ['India', 'USA', 'UK', 'Europe', 'Other']
  },
  {
    id: 'q17',
    number: 17,
    question: 'Where do you want to be in 3 months?',
    type: 'simple',
    options: [
      'In a relationship',
      'Dating regularly',
      'More confident overall',
      'Better at conversations'
    ]
  },
  {
    id: 'q18',
    number: 18,
    question: 'Have you paid for dating coaching before?',
    type: 'simple',
    options: ['Yes, multiple times', 'Yes, once', 'No but considered it', 'No, never']
  }
];

export const psychologicalTraps = [
  {
    id: 'trap1',
    afterQuestion: 8,
    type: 'testimonial',
    theme: 'blue',
    content: {
      quote: "I went from 2 matches a month to 15+ dates in 60 days using these exact strategies",
      author: "Rahul, 26",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    }
  },
  {
    id: 'trap2',
    afterQuestion: 13,
    type: 'warning',
    theme: 'red',
    content: {
      stat: "78% of men make THIS mistake in their first message",
      subtext: "We'll reveal your exact mistakes in your results"
    }
  },
  {
    id: 'trap3',
    afterQuestion: 17,
    type: 'social_proof',
    theme: 'gold',
    content: {
      counter: 1247,
      text: "people took this quiz in the last 24 hours",
      subtext: "Join them in discovering your Rizz Score"
    }
  }
];
