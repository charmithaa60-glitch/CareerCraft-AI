/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentProfile, CareerReport } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

interface Props {
  profile: StudentProfile | null;
  report: CareerReport | null;
  savedReports?: CareerReport[];
  onGenerate: () => void;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ profile, report, savedReports = [], onGenerate, onNavigate }: Props) {
  // Categorize skills for the radar chart
  const getRadarData = () => {
    if (!profile) return [];
    
    const categories = [
      { 
        name: 'Technical', 
        keywords: ['python', 'java', 'js', 'javascript', 'react', 'node', 'sql', 'git', 'docker', 'aws', 'linux', 'testing', 'c++', 'c#', 'php', 'ruby', 'html', 'css', 'typescript', 'go', 'rust'] 
      },
      { 
        name: 'Domain Knowledge', 
        keywords: ['ai', 'ml', 'machine learning', 'data science', 'cybersecurity', 'cloud', 'blockchain', 'iot', 'robotics', 'algorithms', 'structures', 'system design', 'networking', 'database', 'frontend', 'backend', 'ui', 'ux', 'mobile', 'devops'] 
      },
      { 
        name: 'Soft Skills', 
        keywords: [] // Derived directly from profile.softSkills
      }
    ];

    const techSkills = profile.technicalSkills.map(s => s.toLowerCase());
    const softSkills = profile.softSkills.map(s => s.toLowerCase());

    return categories.map(cat => {
      let score = 0;
      if (cat.name === 'Soft Skills') {
        score = Math.min(100, softSkills.length * 20); // 5 soft skills = 100%
      } else if (cat.name === 'Technical') {
        const matches = techSkills.filter(s => cat.keywords.some(k => s.includes(k)));
        score = Math.min(100, matches.length * 20); // 5 tech skills = 100%
      } else if (cat.name === 'Domain Knowledge') {
        const matches = techSkills.filter(s => cat.keywords.some(k => s.includes(k)));
        score = Math.min(100, matches.length * 25); // 4 domain skills = 100%
      }
      return { subject: cat.name, A: score, fullMark: 100 };
    });
  };

  const radarData = getRadarData();

  const completionPercentage = profile ? 
    Math.min(100, Math.round((
      (profile.name ? 1 : 0) + 
      (profile.technicalSkills.length > 0 ? 1 : 0) + 
      (profile.softSkills.length > 0 ? 1 : 0) + 
      (profile.projects ? 1 : 0) + 
      (profile.careerGoal ? 1 : 0)
    ) / 5 * 100)) : 0;

  const stats = [
    { 
      label: 'Profile Completion', 
      value: `${completionPercentage}%`, 
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Skills Entered', 
      value: (profile?.technicalSkills?.length || 0) + (profile?.softSkills?.length || 0), 
      icon: TrendingUp, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: 'Career Readiness', 
      value: report ? `${report.skillGap.coverage}%` : 'N/A', 
      icon: Target, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Open Roadmaps', 
      value: report ? (1 + savedReports.length) : savedReports.length > 0 ? savedReports.length : '0', 
      icon: BookOpen, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {profile?.name?.split(' ')[0] || 'Explorer'}!
            </h1>
            <p className="text-slate-500 max-w-lg mb-6">
              {profile 
                ? `You are currently focusing on becoming a ${profile.careerGoal}. Your readiness is at ${report?.skillGap.coverage || 0}%.`
                : "Let's start by building your professional profile to generate your career blueprint."}
            </p>
            <button 
              onClick={onGenerate}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
            >
              <Sparkles size={20} />
              {profile ? 'Update My Profile' : 'Get Started Now'}
            </button>
          </div>
          
          {/* Radar Chart */}
          <div className="w-full md:w-64 h-64 shrink-0 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-2 relative">
            {profile ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-4">
                <ShieldCheck size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Skill Domains</p>
                <p className="text-[9px] text-slate-400">Complete profile to see chart</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-50 rounded-full -mr-24 -mb-24 blur-3xl opacity-60"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => {
              if (stat.label === 'Profile Completion' || stat.label === 'Skills Entered') onNavigate('profile');
              else if (stat.label === 'Career Readiness') onNavigate('generator');
              else if (stat.label === 'Open Roadmaps') onNavigate('saved');
            }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all text-left"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{stat.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Current Progress</h3>
              <button 
                onClick={() => onNavigate('generator')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                View Roadmap
              </button>
            </div>
            <div className="p-6">
              {report ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Skill Coverage</span>
                      <span className="text-sm font-bold text-indigo-600">{report.skillGap.coverage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-1000" 
                        style={{ width: `${report.skillGap.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-medium text-slate-500 mb-2 uppercase">Core Path</p>
                      <p className="font-semibold text-slate-900">{profile?.careerGoal}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-medium text-slate-500 mb-2 uppercase">Next Milestone</p>
                      <p className="font-semibold text-slate-900 line-clamp-1">{report.roadmap.week1[0]}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Target size={32} />
                  </div>
                  <p className="text-slate-500 text-sm">No career data generated yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Tips or Featured Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-900 text-white p-6 rounded-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">Resume Masterclass</h4>
                <p className="text-indigo-200 text-sm mb-4">Learn how to tailor your technical profile for top recruiters.</p>
                <button 
                  onClick={() => onNavigate('insights')}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all"
                >
                  Read More <ArrowRight size={14} />
                </button>
              </div>
              <BookOpen className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-800 opacity-50 transform rotate-12" />
            </div>
            
            <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">Interview Simulator</h4>
                <p className="text-slate-400 text-sm mb-4">Practice real-world technical and behavioral questions.</p>
                <button 
                  onClick={() => onNavigate('generator')}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all"
                >
                  Start Practice <ArrowRight size={14} />
                </button>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-800 opacity-50 transform -rotate-12" />
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Checklist</h3>
            <div className="space-y-4">
              {[
                { label: 'Complete profile', done: !!profile },
                { label: 'Add 5+ technical skills', done: (profile?.technicalSkills.length || 0) >= 5 },
                { label: 'Generate first report', done: !!report },
                { label: 'Save your roadmap', done: !!report }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <Circle size={18} className="text-slate-300" />
                  )}
                  <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Profile Snapshot</h3>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Current Goal</p>
                  <p className="text-sm font-semibold text-slate-900">{profile.careerGoal}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Specialization</p>
                  <p className="text-sm font-semibold text-slate-900">{profile.branch}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">CGPA</p>
                  <p className="text-sm font-semibold text-slate-900">{profile.cgpa || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Complete your profile to see your snapshot.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
