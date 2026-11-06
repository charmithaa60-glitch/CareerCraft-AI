/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Zap, 
  Target, 
  ChevronRight, 
  Award,
  BookOpen,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGameState, StudentProfile } from '../types';
import { NICHE_QUESTIONS, SKILL_QUESTS, DOMAIN_DETAILS, BUILD_SCENARIOS, DAILY_CHALLENGES } from '../lib/gameData';

interface Props {
  profile: StudentProfile | null;
}

export default function CareerPlay({ profile }: Props) {
  const [gameState, setGameState] = useState<UserGameState>({
    xp: 0,
    level: 'Beginner',
    badges: [],
    completedQuizzes: []
  });
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('careercraft_game_state');
    if (saved) setGameState(JSON.parse(saved));
  }, []);

  const updateGameState = (updates: Partial<UserGameState>) => {
    const newState = { ...gameState, ...updates };
    // Calculate level based on XP
    if (newState.xp >= 1000) newState.level = 'Pro';
    else if (newState.xp >= 300) newState.level = 'Explorer';
    else newState.level = 'Beginner';

    setGameState(newState);
    localStorage.setItem('careercraft_game_state', JSON.stringify(newState));
  };

  const addXP = (amount: number) => {
    updateGameState({ xp: gameState.xp + amount });
  };

  const games = [
    {
      id: 'niche',
      title: 'Niche Discovery',
      description: 'Discover your ideal career path through interactive scenarios.',
      icon: Target,
      difficulty: 'Easy',
      xp: '+100 XP',
      color: 'bg-indigo-500'
    },
    {
      id: 'skill',
      title: 'Skill Quest',
      description: 'Test your technical knowledge and level up your expertise.',
      icon: Zap,
      difficulty: 'Medium',
      xp: '+50 XP / Quiz',
      color: 'bg-amber-500'
    },
    {
      id: 'build',
      title: 'What Would You Build?',
      description: 'Solve real-world challenges by choosing the right tech stack.',
      icon: BookOpen,
      difficulty: 'Medium',
      xp: '+150 XP',
      color: 'bg-emerald-500'
    },
    {
      id: 'daily',
      title: 'Daily Brain Boost',
      description: 'A quick challenge to start your day with a learning win.',
      icon: Trophy,
      difficulty: 'Hard',
      xp: '+200 XP',
      color: 'bg-rose-500'
    }
  ];

  return (
    <div className="space-y-10">
      <AnimatePresence mode="wait">
        {!activeGame ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Header / Progress Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white mb-10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">CareerPlay Dashboard</h2>
                    <p className="text-slate-400">Gamify your growth and discover your potential.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase">Current XP</p>
                      <p className="text-xl font-black">{gameState.xp}</p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                      <p className="text-[10px] font-bold text-amber-400 uppercase">Rank</p>
                      <p className="text-xl font-black">{gameState.level}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Progress to {gameState.level === 'Beginner' ? 'Explorer' : 'Pro'}</span>
                    <span>{gameState.xp} / {gameState.level === 'Beginner' ? '300' : '1000'}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, (gameState.xp / (gameState.level === 'Beginner' ? 300 : 1000)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
            </div>

            {/* Game Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games.map((game) => (
                <div 
                  key={game.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl text-white ${game.color}`}>
                      <game.icon size={24} />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{game.difficulty}</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{game.xp}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{game.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex-1">{game.description}</p>
                  <button 
                    onClick={() => setActiveGame(game.id)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group"
                  >
                    Play Now
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>

            {/* Badges Section */}
            <div className="mt-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award className="text-amber-500" />
                Achievement Badges
              </h3>
              <div className="flex flex-wrap gap-6">
                {gameState.badges.length > 0 ? (
                  gameState.badges.map(badge => (
                    <div key={badge} className="flex flex-col items-center gap-2 w-24">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border-2 border-amber-200 text-amber-600">
                        <Trophy size={32} />
                      </div>
                      <span className="text-[10px] font-bold text-center uppercase text-slate-600">{badge}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm italic">Complete your first challenge to earn badges!</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button 
              onClick={() => setActiveGame(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-medium"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            {activeGame === 'niche' && <NicheDiscovery onComplete={addXP} updateGameState={updateGameState} currentGameState={gameState} />}
            {activeGame === 'skill' && <SkillQuest profile={profile} onComplete={addXP} updateGameState={updateGameState} currentGameState={gameState} />}
            {activeGame === 'build' && <BuildQuest onComplete={addXP} updateGameState={updateGameState} currentGameState={gameState} />}
            {activeGame === 'daily' && <DailyBoost onComplete={addXP} updateGameState={updateGameState} currentGameState={gameState} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function BuildQuest({ onComplete, updateGameState, currentGameState }: { 
  onComplete: (xp: number) => void, 
  updateGameState: (s: Partial<UserGameState>) => void,
  currentGameState: UserGameState
}) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, explanation?: string } | null>(null);

  const handleAnswer = (option: any) => {
    if (feedback) return;
    setFeedback({ isCorrect: option.isCorrect, explanation: option.explanation });

    setTimeout(() => {
      setFeedback(null);
      if (step < BUILD_SCENARIOS.length - 1) {
        setStep(step + 1);
      } else {
        setFinished(true);
        onComplete(150);
        if (!currentGameState.badges.includes('Architect')) {
          updateGameState({ badges: [...currentGameState.badges, 'Architect'] });
        }
      }
    }, 3000);
  };

  if (finished) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Architecture Master!</h2>
        <p className="text-slate-500 mt-2">You've successfully solved real-world scaling challenges.</p>
        <div className="my-8 p-4 bg-indigo-50 rounded-2xl">
          <p className="text-sm font-bold text-indigo-700">+150 XP & "Architect" Badge earned!</p>
        </div>
      </div>
    );
  }

  const currentQ = BUILD_SCENARIOS[step];
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <div className="mb-10">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Scenario {step + 1} / {BUILD_SCENARIOS.length}</span>
        <h2 className="text-xl font-bold text-slate-900 mt-2">{currentQ.text}</h2>
      </div>
      <div className="space-y-4">
        {currentQ.options.map((opt: any, i: number) => (
          <button 
            key={i} 
            disabled={!!feedback}
            onClick={() => handleAnswer(opt)}
            className={`w-full p-5 text-left border rounded-2xl transition-all ${!feedback ? 'hover:border-emerald-500 hover:bg-emerald-50' : opt.isCorrect ? 'bg-emerald-50 border-emerald-500' : 'opacity-50'}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      {feedback && (
        <div className={`mt-6 p-4 rounded-xl ${feedback.isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
          <p className="text-sm font-medium">{feedback.explanation}</p>
        </div>
      )}
    </div>
  );
}

function DailyBoost({ onComplete, updateGameState, currentGameState }: { 
  onComplete: (xp: number) => void, 
  updateGameState: (s: Partial<UserGameState>) => void,
  currentGameState: UserGameState
}) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const challenge = DAILY_CHALLENGES[0];

  const handleAnswer = (isCorrect: boolean) => {
    if (step < challenge.questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
      onComplete(200);
      const today = Date.now();
      updateGameState({ lastDailyBoost: today });
      if (!currentGameState.badges.includes('Early Bird')) {
        updateGameState({ badges: [...currentGameState.badges, 'Early Bird'] });
      }
    }
  };

  if (finished) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Daily Boost Complete!</h2>
        <p className="text-slate-500 mt-2">Come back tomorrow for a new set of challenges.</p>
        <div className="mt-6 p-4 bg-rose-50 rounded-2xl">
          <p className="text-sm font-bold text-rose-700">+200 XP earned!</p>
        </div>
      </div>
    );
  }

  const q = challenge.questions[step];
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-full">{q.type} Challenge</span>
        <h2 className="text-xl font-bold text-slate-900 mt-4">{q.text}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {q.options.map((opt: any, i: number) => (
          <button key={i} onClick={() => handleAnswer(opt.isCorrect)} className="p-5 border border-slate-200 rounded-2xl hover:border-rose-500 hover:bg-rose-50 transition-all text-left">
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}


function NicheDiscovery({ onComplete, updateGameState, currentGameState }: { 
  onComplete: (xp: number) => void, 
  updateGameState: (s: Partial<UserGameState>) => void,
  currentGameState: UserGameState
}) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const handleAnswer = (weight: Record<string, number>) => {
    const newScores = { ...scores };
    Object.entries(weight).forEach(([domain, score]) => {
      newScores[domain] = (newScores[domain] || 0) + score;
    });
    setScores(newScores);

    if (step < NICHE_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
      onComplete(100);
      updateGameState({ nicheInterests: newScores });
    }
  };

  const getTopMatches = () => {
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  if (finished) {
    const topMatches = getTopMatches();
    return (
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Career Niche Found!</h2>
          <p className="text-slate-500 italic mt-1">Based on your interests, here are your best matches:</p>
        </div>

        <div className="space-y-6">
          {topMatches.map(([domain, score], idx) => (
            <div key={domain} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span className="text-indigo-600">#{idx + 1}</span> {domain}
                </h4>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{score} Score</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{DOMAIN_DETAILS[domain]?.description}</p>
              <div className="flex flex-wrap gap-2">
                {DOMAIN_DETAILS[domain]?.skills.map((s: string) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-slate-500">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-indigo-900 rounded-2xl text-white">
          <h4 className="font-bold mb-2">Recommended Starter Project</h4>
          <p className="text-indigo-200 text-sm">{DOMAIN_DETAILS[topMatches[0][0]]?.projects[0]}</p>
        </div>
      </div>
    );
  }

  const currentQ = NICHE_QUESTIONS[step];
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step {step + 1} of {NICHE_QUESTIONS.length}</span>
          <div className="flex gap-1">
            {NICHE_QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-100'}`}></div>
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{currentQ.text}</h2>
      </div>

      <div className="space-y-4">
        {currentQ.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option.weight!)}
            className="w-full p-6 text-left border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group relative overflow-hidden"
          >
            <span className="text-slate-700 font-medium relative z-10">{option.text}</span>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={20} className="text-indigo-600" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SkillQuest({ profile, onComplete, updateGameState, currentGameState }: { 
  profile: StudentProfile | null, 
  onComplete: (xp: number) => void,
  updateGameState: (s: Partial<UserGameState>) => void,
  currentGameState: UserGameState
}) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, explanation?: string } | null>(null);

  const topics = Object.keys(SKILL_QUESTS);

  const handleAnswer = (option: any) => {
    if (feedback) return;
    
    setFeedback({ isCorrect: option.isCorrect, explanation: option.explanation });
    if (option.isCorrect) setCorrectCount(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      if (step < SKILL_QUESTS[selectedTopic!]!.length - 1) {
        setStep(step + 1);
      } else {
        setFinished(true);
        onComplete(50);
        updateGameState({ completedQuizzes: [...currentGameState.completedQuizzes, selectedTopic!] });
      }
    }, 2500);
  };

  if (!selectedTopic) {
    return (
      <div className="space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Quest</h2>
          <p className="text-slate-500">Pick a topic to test your knowledge and earn XP.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-amber-500 hover:bg-amber-50/20 transition-all text-left"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                  {topic[0]}
                </div>
                {currentGameState.completedQuizzes.includes(topic) && (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                )}
              </div>
              <h4 className="font-bold text-slate-900">{topic} Quest</h4>
              <p className="text-xs text-slate-500 mt-1">{SKILL_QUESTS[topic]!.length} Questions · Medium</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Quest Completed!</h2>
        <p className="text-slate-500 mt-2">You answered {correctCount} out of {SKILL_QUESTS[selectedTopic!]!.length} correctly.</p>
        
        <div className="my-8 py-4 px-6 bg-slate-50 rounded-2xl flex justify-between items-center">
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase">XP Earned</p>
            <p className="text-xl font-black text-slate-900">+50 XP</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</p>
            <p className="text-xl font-black text-slate-900">
              {Math.round((correctCount / SKILL_QUESTS[selectedTopic!]!.length) * 100)}%
            </p>
          </div>
        </div>

        <button 
          onClick={() => setSelectedTopic(null)}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Try Another Quest
        </button>
      </div>
    );
  }

  const currentQ = SKILL_QUESTS[selectedTopic]![step];
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{selectedTopic} Quest: {step + 1} / {SKILL_QUESTS[selectedTopic]!.length}</span>
          <div className="flex gap-1">
            {SKILL_QUESTS[selectedTopic]!.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-4 bg-amber-500' : 'w-1.5 bg-slate-100'}`}></div>
            ))}
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight">{currentQ.text}</h2>
      </div>

      <div className="space-y-4">
        {currentQ.options.map((option, i) => (
          <button
            key={i}
            disabled={!!feedback}
            onClick={() => handleAnswer(option)}
            className={`
              w-full p-5 text-left border rounded-2xl transition-all relative overflow-hidden
              ${!feedback ? 'border-slate-200 hover:border-amber-500 hover:bg-amber-50/50' : ''}
              ${feedback?.isCorrect && option.isCorrect ? 'bg-emerald-50 border-emerald-500' : ''}
              ${feedback && !feedback.isCorrect && option.isCorrect ? 'bg-emerald-50 border-emerald-500' : ''}
              ${feedback && !feedback.isCorrect && !option.isCorrect && feedback.explanation?.includes(option.text) ? 'bg-rose-50 border-rose-500' : ''}
            `}
          >
            <span className="text-slate-700 font-medium">{option.text}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 p-6 rounded-2xl ${feedback.isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}
          >
            <p className="font-bold flex items-center gap-2 mb-1">
              {feedback.isCorrect ? 'Correct!' : 'Not quite right.'}
            </p>
            <p className="text-sm opacity-80 leading-relaxed">{feedback.explanation || 'Next question loading...'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
