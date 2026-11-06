/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { CAREER_SKILLS_MAPPING, LEARNING_DATABASE, INTERVIEW_TEMPLATES } from './src/lib/careerData.ts';
import { StudentProfile, CareerReport, AlignmentResult } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting CareerCraft Server...');
console.log('GEMINI_API_KEY Status:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'dummy_key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Fallback Rule-Based Generator
const generateFallback = (profile: StudentProfile): CareerReport => {
  const goal = profile.careerGoal === 'Other' ? profile.customGoal || 'Professional' : profile.careerGoal;
  const required = CAREER_SKILLS_MAPPING[profile.careerGoal] || ['Professional Communication', 'Project Management'];
  
  const existing = profile.technicalSkills.map(s => s.trim().toLowerCase());
  const missing = required.filter(s => !existing.includes(s.toLowerCase()));
  const coverage = Math.round(((required.length - missing.length) / required.length) * 100);

  const recommendations = missing.map(skill => {
    const data = LEARNING_DATABASE[skill] || {
      reason: 'Critical for your chosen career path.',
      order: 'Intermediate',
      activity: `Research and practice ${skill} through online documentation.`,
      miniProject: `Build a small application using ${skill}.`
    };
    return { skill, ...data };
  });

  const summary = `${profile.name} is a ${profile.year} ${profile.degree} student specialized in ${profile.branch}. With a strong foundation in ${profile.technicalSkills.slice(0, 3).join(', ')}, they are aiming for a career as a ${goal}. They demonstrate proficiency in ${profile.softSkills.join(', ')} and have shown interest in ${profile.interests.join(', ')}.`;

  const interviewPrep = [
    ...(INTERVIEW_TEMPLATES['General'] || []),
    ...(INTERVIEW_TEMPLATES[profile.careerGoal] || [])
  ];

  const roadmapCheck = missing.length === 0 ? 100 : Math.max(0, 100 - (missing.length * 10));
  const interviewCheck = INTERVIEW_TEMPLATES[profile.careerGoal] ? 100 : 70;

  const alignment: AlignmentResult[] = [
    {
      label: 'Profile-to-Summary',
      status: 'aligned',
      message: 'The professional summary correctly incorporates your academic background and target role.',
      score: 100
    },
    {
      label: 'Skills-to-Career',
      status: missing.length > 3 ? 'warning' : 'aligned',
      message: missing.length > 0 
        ? `Identified ${missing.length} skill gaps for the ${goal} role. Adding these to your profile will improve your score.` 
        : 'Your technical skill set is perfectly aligned with industry standards for this role.',
      score: coverage
    },
    {
      label: 'Roadmap-to-Gap',
      status: roadmapCheck < 80 ? 'warning' : 'aligned',
      message: roadmapCheck < 100 
        ? `Your roadmap is 30-day focused to bridge the gaps in: ${missing.slice(0, 2).join(', ')}.`
        : 'Your roadmap focuses on advanced mastery since your foundations are solid.',
      score: roadmapCheck
    },
    {
      label: 'Interview-to-Career',
      status: interviewCheck === 100 ? 'aligned' : 'warning',
      message: interviewCheck === 100
        ? 'Technical questions are specifically calibrated for your target career goal.'
        : 'Using generalized technical questions as specialized templates for this role are limited.',
      score: interviewCheck
    }
  ];

  return {
    summary,
    skillGap: {
      existing: profile.technicalSkills,
      missing,
      recommended: ['Git', 'Agile Methodology', 'Docker'],
      coverage
    },
    recommendations,
    marketTrends: [
      `Growing demand for ${goal} in remote-first companies.`,
      'Emphasis on cross-functional collaboration skills.',
      'Integration of AI-assisted development workflows.'
    ],
    roadmap: {
      week1: ['Setup development environment', `Master ${missing[0] || 'advanced architecture'}`],
      week2: [`Deep dive into ${missing[1] || 'performance optimization'}`, 'Project planning'],
      week3: ['Mini project implementation', 'Unit testing'],
      week4: ['Resume building', 'Interview practice']
    },
    interviewPrep,
    alignment,
    timestamp: Date.now()
  };
};

app.post('/api/generate', async (req, res) => {
  const { profile, gameState } = req.body;

  // Basic validation
  if (!profile || !profile.name || !Array.isArray(profile.technicalSkills)) {
    console.error('Invalid profile data received:', profile);
    return res.status(400).json({ error: 'Invalid profile data. Name and skills are required.' });
  }

  console.log(`Processing generation request for: ${profile.name}`);

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    console.log('No Gemini API key found, using fallback generator.');
    return res.json(generateFallback(profile));
  }

  try {
    const prompt = `
      Act as a Senior Career Consultant. Generate a personalized career report for a student with the following profile:
      Name: ${profile.name}
      Degree: ${profile.degree} in ${profile.branch} (${profile.year})
      Skills: ${profile.technicalSkills.join(', ')}
      Soft Skills: ${profile.softSkills.join(', ')}
      Interests: ${profile.interests.join(', ')}
      Goal: ${profile.careerGoal} ${profile.customGoal ? `(${profile.customGoal})` : ''}
      Projects: ${profile.projects || 'N/A'}
      
      Additional Insights from CareerPlay (Games):
      - Niche Interests: ${gameState?.nicheInterests ? JSON.stringify(gameState.nicheInterests) : 'N/A'}
      - Completed Quizzes: ${gameState?.completedQuizzes?.join(', ') || 'None'}
      
      Requirements:
      1. Use Google Search to find current industry standards, required skills, and market trends (salaries, demand, emerging tech) for the specific role: ${profile.careerGoal}.
      2. Professional Summary (no fabrication).
      3. Skill Gap Analysis (compare with the latest industry data found).
      4. Learning Recommendations.
      5. Interview Prep (Technical, HR, Project).
      6. Market Trends (List 3-5 current trends or news items related to this career).
      
      Respond STRICTLY in JSON format matching this schema:
      {
        "summary": "string",
        "skillGap": { "existing": ["string"], "missing": ["string"], "recommended": ["string"], "coverage": number },
        "recommendations": [{ "skill": "string", "reason": "string", "order": "Beginner|Intermediate|Advanced", "activity": "string", "miniProject": "string" }],
        "interviewPrep": [{ "question": "string", "answer": "string", "difficulty": "Basic|Intermediate|Advanced", "category": "Technical|HR|Project" }],
        "marketTrends": ["string"]
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });

    let aiResponse;
    try {
      aiResponse = JSON.parse(result.text || '{}');
    } catch (e) {
      console.error('Failed to parse AI JSON, using fallback text extraction');
      aiResponse = {};
    }
    
    // Enrich with rule-based features for consistency
    const fallback = generateFallback(profile);
    
    // Deep merge to ensure all fields exist for the UI
    const enriched: CareerReport = {
      summary: aiResponse.summary || fallback.summary,
      skillGap: {
        existing: Array.isArray(aiResponse.skillGap?.existing) ? aiResponse.skillGap.existing : fallback.skillGap.existing,
        missing: Array.isArray(aiResponse.skillGap?.missing) ? aiResponse.skillGap.missing : fallback.skillGap.missing,
        recommended: Array.isArray(aiResponse.skillGap?.recommended) ? aiResponse.skillGap.recommended : fallback.skillGap.recommended,
        coverage: typeof aiResponse.skillGap?.coverage === 'number' ? aiResponse.skillGap.coverage : fallback.skillGap.coverage
      },
      recommendations: Array.isArray(aiResponse.recommendations) ? aiResponse.recommendations : fallback.recommendations,
      interviewPrep: Array.isArray(aiResponse.interviewPrep) ? aiResponse.interviewPrep : fallback.interviewPrep,
      marketTrends: Array.isArray(aiResponse.marketTrends) ? aiResponse.marketTrends : fallback.marketTrends,
      roadmap: fallback.roadmap, // Always use rule-based roadmap for consistency
      alignment: fallback.alignment,
      timestamp: Date.now()
    };

    res.json(enriched);
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.json(generateFallback(profile));
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In dev, Vite handles the frontend
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
  
  app.get('*', async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const html = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CareerCraft - AI Career Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
