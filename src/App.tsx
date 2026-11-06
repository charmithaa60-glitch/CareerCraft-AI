/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  Sparkles, 
  Target, 
  Map, 
  MessageSquare, 
  Save, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck,
  Newspaper,
  Gamepad2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import ReportView from './components/ReportView';
import SavedReports from './components/SavedReports';
import MarketInsights from './components/MarketInsights';
import CareerPlay from './components/CareerPlay';
import { StudentProfile, CareerReport } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [currentReport, setCurrentReport] = useState<CareerReport | null>(null);
  const [savedReports, setSavedReports] = useState<CareerReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadSavedData = () => {
      const savedProfile = localStorage.getItem('careercraft_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (!parsed.technicalSkills) parsed.technicalSkills = [];
        if (!parsed.softSkills) parsed.softSkills = [];
        if (!parsed.interests) parsed.interests = [];
        setProfile(parsed);
      }

      const savedReportsData = localStorage.getItem('careercraft_reports');
      if (savedReportsData) setSavedReports(JSON.parse(savedReportsData));
    };

    loadSavedData();

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'careercraft_profile' || e.key === 'careercraft_reports') {
        loadSavedData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    localStorage.setItem('careercraft_profile', JSON.stringify(newProfile));
  };

  const handleGenerate = async (profileData: StudentProfile) => {
    setIsGenerating(true);
    setActiveTab('generator');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profile: profileData, 
          gameState: JSON.parse(localStorage.getItem('careercraft_game_state') || 'null') 
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setCurrentReport(data);
      
      // Auto-save the latest report
      const updatedSaved = [data, ...savedReports.slice(0, 9)];
      setSavedReports(updatedSaved);
      localStorage.setItem('careercraft_reports', JSON.stringify(updatedSaved));
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(error.name === 'AbortError' 
        ? 'Generation timed out. Please try again with fewer skills or simplified details.' 
        : `Generation failed: ${error.message}. Please check if the server is running.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
    { id: 'generator', label: 'Career Generator', icon: Sparkles },
    { id: 'play', label: 'CareerPlay', icon: Gamepad2 },
    { id: 'insights', label: 'Market Insights', icon: Newspaper },
    { id: 'saved', label: 'Saved Reports', icon: Save },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-slate-200"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed lg:sticky lg:top-0 z-40
        w-64 h-screen bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
        flex flex-col shrink-0
      `}>
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              C
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">CareerCraft</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium border border-slate-200">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-900">{profile?.name || 'Guest User'}</p>
              <p className="text-xs text-slate-500 truncate">{profile?.degree || 'No Profile'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Home</span>
              <ChevronRight size={12} />
              <span>{navItems.find(i => i.id === activeTab)?.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
              <ShieldCheck size={14} />
              <span>AI Analysis Online</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Dashboard 
                  profile={profile} 
                  report={currentReport} 
                  savedReports={savedReports}
                  onGenerate={() => setActiveTab('profile')}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProfileForm 
                  profile={profile || {
                    name: '',
                    degree: '',
                    branch: '',
                    year: 'Second Year',
                    cgpa: '',
                    technicalSkills: [],
                    softSkills: [],
                    interests: [],
                    careerGoal: 'Software Engineer',
                    customGoal: '',
                    projects: '',
                    experience: '',
                    certifications: '',
                    improvements: ''
                  }} 
                  onSave={updateProfile} 
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </motion.div>
            )}

            {activeTab === 'generator' && (
              <motion.div
                key="generator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 font-medium">Crafting your career profile...</p>
                    <p className="text-xs text-slate-400 mt-2">Analyzing skills and industry trends</p>
                  </div>
                ) : currentReport ? (
                  <ReportView report={currentReport} profile={profile!} onRegenerate={() => handleGenerate(profile!)} />
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <Sparkles size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No Report Generated Yet</h3>
                    <p className="text-slate-500 mb-6">Complete your profile to generate a personalized career blueprint.</p>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Setup Profile
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <MarketInsights profile={profile} />
              </motion.div>
            )}

            {activeTab === 'play' && (
              <motion.div
                key="play"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CareerPlay profile={profile} />
              </motion.div>
            )}

            {activeTab === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SavedReports 
                  reports={savedReports} 
                  onView={(report) => {
                    setCurrentReport(report);
                    setActiveTab('generator');
                  }}
                  onDelete={(id) => {
                    const filtered = savedReports.filter(r => r.timestamp !== id);
                    setSavedReports(filtered);
                    localStorage.setItem('careercraft_reports', JSON.stringify(filtered));
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="px-8 py-8 border-t border-slate-200 bg-white mt-10 text-center">
          <p className="text-sm text-slate-500 italic">
            "Your career profile information is used only to generate personalized career recommendations. 
            This prototype stores saved reports locally in your browser."
          </p>
        </footer>
      </main>
    </div>
  );
}
