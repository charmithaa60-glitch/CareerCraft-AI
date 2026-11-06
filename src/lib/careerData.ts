/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const CAREER_SKILLS_MAPPING: Record<string, string[]> = {
  'Software Engineer': [
    'Data Structures',
    'Algorithms',
    'Java',
    'Python',
    'System Design',
    'Git',
    'SQL',
    'Testing'
  ],
  'AI/ML Engineer': [
    'Python',
    'Machine Learning',
    'Deep Learning',
    'Statistics',
    'Mathematics',
    'NumPy',
    'Pandas',
    'PyTorch',
    'TensorFlow',
    'SQL'
  ],
  'Data Analyst': [
    'SQL',
    'Excel',
    'Tableau',
    'Power BI',
    'Python',
    'R',
    'Statistics',
    'Data Visualization'
  ],
  'Full Stack Developer': [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node.js',
    'Express',
    'SQL',
    'MongoDB',
    'Git',
    'REST APIs'
  ],
  'Data Scientist': [
    'Python',
    'Statistics',
    'Machine Learning',
    'Big Data',
    'SQL',
    'Data Mining',
    'Calculus',
    'R'
  ],
  'Cybersecurity Analyst': [
    'Networking',
    'Linux',
    'Ethical Hacking',
    'Cryptography',
    'Security Protocols',
    'Firewalls',
    'Incident Response',
    'SQL'
  ]
};

export const LEARNING_DATABASE: Record<string, any> = {
  'Python': {
    reason: 'Essential for modern backend, data science, and AI development.',
    order: 'Beginner',
    activity: 'Complete a Python crash course focusing on data structures and libraries.',
    miniProject: 'Automated Web Scraper or Budget Tracker.'
  },
  'SQL': {
    reason: 'Fundamental for managing and querying data in almost any software role.',
    order: 'Beginner',
    activity: 'Practice SELECT, JOIN, and GROUP BY operations on platforms like SQLZoo.',
    miniProject: 'Library Management System Database.'
  },
  'Machine Learning': {
    reason: 'Core requirement for AI roles; enables predictive modeling.',
    order: 'Intermediate',
    activity: 'Learn supervised and unsupervised learning algorithms via Scikit-Learn.',
    miniProject: 'House Price Prediction Model.'
  },
  'React': {
    reason: 'Industry standard for building interactive and scalable frontends.',
    order: 'Intermediate',
    activity: 'Build a multi-page application using hooks and state management.',
    miniProject: 'E-commerce Product Dashboard.'
  },
  'Algorithms': {
    reason: 'Critical for passing technical interviews and writing efficient code.',
    order: 'Intermediate',
    activity: 'Solve 2 problems daily on LeetCode/HackerRank (Arrays, Linked Lists, Trees).',
    miniProject: 'Pathfinding Visualizer.'
  },
  'Deep Learning': {
    reason: 'Advanced AI capability for complex pattern recognition (vision, language).',
    order: 'Advanced',
    activity: 'Implement Neural Networks using PyTorch or TensorFlow.',
    miniProject: 'Image Classifier or Sentiment Analyzer.'
  }
};

export const INTERVIEW_TEMPLATES: Record<string, any[]> = {
  'General': [
    {
      question: "Tell me about a challenging project you worked on.",
      answer: "Use the STAR method: Situation, Task, Action, Result. Focus on your specific contribution and how you overcame technical hurdles.",
      difficulty: 'Basic',
      category: 'Project'
    },
    {
      question: "Why do you want to work in this specific career field?",
      answer: "Connect your academic interests and projects to the industry's future and your personal passion.",
      difficulty: 'Basic',
      category: 'HR'
    }
  ],
  'Software Engineer': [
    {
      question: "What is the difference between an Interface and an Abstract Class?",
      answer: "Interfaces define a contract; Abstract classes provide a base implementation. Use interfaces for 'can-do' and abstract classes for 'is-a'.",
      difficulty: 'Intermediate',
      category: 'Technical'
    }
  ],
  'AI/ML Engineer': [
    {
      question: "Explain the Bias-Variance tradeoff.",
      answer: "Bias is error from erroneous assumptions; Variance is error from sensitivity to small fluctuations. You want a balance to avoid underfitting and overfitting.",
      difficulty: 'Intermediate',
      category: 'Technical'
    }
  ]
};
