/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  name: string;
  degree: string;
  branch: string;
  year: string;
  cgpa?: string;
  technicalSkills: string[];
  softSkills: string[];
  interests: string[];
  careerGoal: string;
  customGoal?: string;
  projects?: string;
  experience?: string;
  certifications?: string;
  improvements?: string;
}

export interface SkillGapItem {
  skill: string;
  importance: string;
  isMissing: boolean;
}

export interface LearningRecommendation {
  skill: string;
  reason: string;
  order: 'Beginner' | 'Intermediate' | 'Advanced';
  activity: string;
  miniProject: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  category: 'Technical' | 'HR' | 'Project';
}

export interface AlignmentResult {
  label: string;
  status: 'aligned' | 'warning';
  message: string;
  score: number;
}

export interface CareerReport {
  summary: string;
  skillGap: {
    existing: string[];
    missing: string[];
    recommended: string[];
    coverage: number;
  };
  recommendations: LearningRecommendation[];
  roadmap: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
  interviewPrep: InterviewQuestion[];
  alignment: AlignmentResult[];
  marketTrends?: string[];
  timestamp: number;
}

export interface UserGameState {
  xp: number;
  level: 'Beginner' | 'Explorer' | 'Pro';
  badges: string[];
  completedQuizzes: string[];
  lastDailyBoost?: number;
  nicheInterests?: Record<string, number>;
}

export interface GameQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    weight?: Record<string, number>; // For Niche Discovery
    isCorrect?: boolean; // For Skill Quest
    explanation?: string;
  }[];
}
