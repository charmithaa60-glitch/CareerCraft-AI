/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameQuestion } from '../types';

export const NICHE_QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    text: "Which of these activities sounds most exciting to you?",
    options: [
      { text: "Building a intelligent robot that learns from its environment", weight: { "AI/ML": 10, "Robotics": 8 } },
      { text: "Creating a stunning mobile app that millions of people use daily", weight: { "Full Stack Development": 10, "UI/UX Design": 7 } },
      { text: "Investigating a digital heist and securing high-value assets", weight: { "Cybersecurity": 10, "Networking": 6 } },
      { text: "Analyzing complex data patterns to predict stock market trends", weight: { "Data Science": 10, "Finance": 5 } }
    ]
  },
  {
    id: 2,
    text: "How do you prefer to solve problems?",
    options: [
      { text: "By using math and logic to find hidden relationships in data", weight: { "Data Science": 8, "AI/ML": 10 } },
      { text: "By designing a visual system that makes tasks effortless for users", weight: { "UI/UX Design": 10, "Frontend": 7 } },
      { text: "By configuring powerful servers that never go down", weight: { "Cloud Computing": 10, "DevOps": 8 } },
      { text: "By writing clean, scalable code for a complex software system", weight: { "Software Engineering": 10, "Full Stack Development": 8 } }
    ]
  },
  {
    id: 3,
    text: "What type of project would you like to brag about?",
    options: [
      { text: "A self-driving car algorithm", weight: { "AI/ML": 10, "Robotics": 7 } },
      { text: "A high-security encryption protocol", weight: { "Cybersecurity": 10, "Blockchain": 8 } },
      { text: "A massive multi-tenant e-commerce platform", weight: { "Full Stack Development": 10, "Software Engineering": 8 } },
      { text: "A data visualization dashboard that changed a business strategy", weight: { "Data Science": 10, "Business Analysis": 7 } }
    ]
  }
];

export const SKILL_QUESTS: Record<string, GameQuestion[]> = {
  "Python": [
    {
      id: 1,
      text: "What is the output of: print(type([1, 2, 3]))?",
      options: [
        { text: "<class 'list'>", isCorrect: true, explanation: "Square brackets denote a list in Python." },
        { text: "<class 'tuple'>", isCorrect: false, explanation: "Tuples use parentheses ()." },
        { text: "<class 'array'>", isCorrect: false, explanation: "Arrays are not a built-in primitive type like lists." },
        { text: "<class 'dict'>", isCorrect: false, explanation: "Dictionaries use curly braces {}." }
      ]
    },
    {
      id: 2,
      text: "Which keyword is used to define a function in Python?",
      options: [
        { text: "func", isCorrect: false },
        { text: "define", isCorrect: false },
        { text: "def", isCorrect: true, explanation: "The 'def' keyword starts a function definition." },
        { text: "function", isCorrect: false }
      ]
    }
  ],
  "SQL": [
    {
      id: 1,
      text: "Which SQL clause is used to filter result sets?",
      options: [
        { text: "WHERE", isCorrect: true, explanation: "The WHERE clause is used to extract only those records that fulfill a specified condition." },
        { text: "FILTER", isCorrect: false },
        { text: "HAVING", isCorrect: false, explanation: "HAVING is for filtering groups, not individual rows." },
        { text: "GROUP BY", isCorrect: false }
      ]
    }
  ],
  "JavaScript": [
    {
      id: 1,
      text: "Which of the following is NOT a way to declare a variable in ES6?",
      options: [
        { text: "var", isCorrect: false },
        { text: "let", isCorrect: false },
        { text: "const", isCorrect: false },
        { text: "set", isCorrect: true, explanation: "'set' is used for creating unique collections, not variable declaration." }
      ]
    }
  ]
};

export const DOMAIN_DETAILS: Record<string, any> = {
  "AI/ML": {
    description: "Creating systems that learn and adapt.",
    skills: ["Python", "Linear Algebra", "Statistics", "Deep Learning"],
    projects: ["Image Recognizer", "Chatbot", "Fraud Detector"]
  },
  "Data Science": {
    description: "Extracting insights from messy data.",
    skills: ["SQL", "Statistics", "Pandas", "Tableau"],
    projects: ["Market Analysis", "Customer Segmentation", "Predictive Modeling"]
  },
  "Full Stack Development": {
    description: "Building complete web applications.",
    skills: ["React", "Node.js", "SQL", "HTML/CSS"],
    projects: ["Social Media Platform", "Real-time Chat", "Portfolio Site"]
  },
  "Cybersecurity": {
    description: "Protecting digital systems and networks.",
    skills: ["Networking", "Linux", "Cryptography", "Penetration Testing"],
    projects: ["Secure Vault", "Network Monitor", "Auth System"]
  }
};

export const BUILD_SCENARIOS: GameQuestion[] = [
  {
    id: 1,
    text: "Scenario: You need to build a real-time stock trading application that handles millions of transactions per second. Which technology stack would you prioritize?",
    options: [
      { 
        text: "Python (Django) + SQLite", 
        isCorrect: false, 
        explanation: "SQLite is not suitable for high-concurrency millions of transactions. Django is great but maybe not the fastest for high-frequency trading." 
      },
      { 
        text: "Node.js (TypeScript) + Redis + PostgreSQL", 
        isCorrect: true, 
        explanation: "Redis handles high-speed caching/messaging, Node.js is excellent for real-time I/O, and Postgres provides robust persistence." 
      },
      { 
        text: "PHP (Laravel) + MySQL", 
        isCorrect: false, 
        explanation: "While solid for many apps, it's typically slower for ultra-high-frequency real-time transaction processing." 
      },
      { 
        text: "HTML/CSS + Firebase", 
        isCorrect: false, 
        explanation: "Firebase is great for real-time, but for millions of transactions per second, you'd need a more custom infrastructure." 
      }
    ]
  },
  {
    id: 2,
    text: "Scenario: You are designing a recommendation system for a massive streaming platform. Which approach is most effective for 'Users who watched this also watched...'?",
    options: [
      { 
        text: "Simple IF/ELSE statements", 
        isCorrect: false, 
        explanation: "This doesn't scale and can't handle complex user behavior patterns." 
      },
      { 
        text: "Collaborative Filtering (Machine Learning)", 
        isCorrect: true, 
        explanation: "Collaborative filtering analyzes patterns between users and items to make highly accurate recommendations." 
      },
      { 
        text: "Random selection from the database", 
        isCorrect: false, 
        explanation: "This provides no personalization or value to the user." 
      },
      { 
        text: "Manual curation by staff", 
        isCorrect: false, 
        explanation: "Impossible to scale for millions of users and thousands of titles." 
      }
    ]
  }
];

export const DAILY_CHALLENGES = [
  {
    date: new Date().toDateString(),
    questions: [
      {
        type: 'Technical',
        text: "What is the time complexity of searching for an element in a balanced binary search tree?",
        options: [
          { text: "O(1)", isCorrect: false },
          { text: "O(log n)", isCorrect: true, explanation: "In a balanced BST, each step halves the remaining search space." },
          { text: "O(n)", isCorrect: false },
          { text: "O(n log n)", isCorrect: false }
        ]
      },
      {
        type: 'Logical',
        text: "If all Bloops are Razzies and all Razzies are Lurgies, are all Bloops definitely Lurgies?",
        options: [
          { text: "Yes", isCorrect: true, explanation: "This is a transitive relation: Bloop -> Razzie -> Lurgy." },
          { text: "No", isCorrect: false }
        ]
      },
      {
        type: 'Concept',
        text: "What does 'Edge Computing' primarily aim to reduce?",
        options: [
          { text: "Data security", isCorrect: false },
          { text: "Latency", isCorrect: true, explanation: "Processing data closer to the source reduces the time it takes for data to travel." },
          { text: "Storage cost", isCorrect: false }
        ]
      }
    ]
  }
];

