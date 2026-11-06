/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Plus, X, Sparkles, Save, Info, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '../types';

interface Props {
  profile: StudentProfile;
  onSave: (profile: StudentProfile) => void;
  onGenerate: (profile: StudentProfile) => void;
  isGenerating: boolean;
}

export default function ProfileForm({ profile, onSave, onGenerate, isGenerating }: Props) {
  // Local state for the form to avoid excessive parent re-renders while typing
  const [localProfile, setLocalProfile] = useState<StudentProfile>(profile);
  const profileRef = useRef(localProfile); // Keep latest state for unmount persistence
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const [showGuide, setShowGuide] = useState(true);

  // Sync local state when parent profile changes (e.g. initial load or external update)
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  // Update ref whenever local state changes
  useEffect(() => {
    profileRef.current = localProfile;
  }, [localProfile]);

  // Ensure data is saved when navigating away (unmounting)
  useEffect(() => {
    return () => {
      onSave(profileRef.current);
    };
  }, []);

  const fieldGuides = [
    {
      label: 'Necessary Fields',
      status: 'Required',
      items: [
        { name: 'Full Name', format: 'John Doe', reason: 'Used for professional summary generation.' },
        { name: 'Degree / Course', format: 'B.Tech, B.S., M.C.A.', reason: 'Sets the academic context for your profile.' },
        { name: 'Branch / Specialization', format: 'Computer Science, AI & ML', reason: 'Determines the baseline for skill gap analysis.' },
        { name: 'Technical Skills', format: 'Python, SQL, React', reason: 'Critical for mapping your readiness to career goals.' }
      ]
    },
    {
      label: 'Optional Fields',
      status: 'Recommended',
      items: [
        { name: 'CGPA', format: '9.2 / 10.0', reason: 'Adds quantitative validation to your academic performance.' },
        { name: 'Projects', format: 'Describe 2-3 key apps', reason: 'Allows AI to generate project-specific interview questions.' },
        { name: 'Experience', format: '3 Months at Tech Corp', reason: 'Highlights practical exposure and professional growth.' },
        { name: 'Certifications', format: 'AWS Certified, Google IT', reason: 'Showcases specialized expertise beyond academics.' }
      ]
    }
  ];

  // Persistence handler
  const handleSave = () => {
    onSave(localProfile);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleAddItem = (field: 'technicalSkills' | 'interests', value: string) => {
    if (!value.trim()) return;
    const newList = [...(localProfile[field] || []), value.trim()];
    const updated = { ...localProfile, [field]: newList };
    setLocalProfile(updated);
    onSave(updated); // Immediate save for list items
    if (field === 'technicalSkills') setNewSkill('');
    else setNewInterest('');
  };

  const removeItem = (field: 'technicalSkills' | 'interests' | 'softSkills', index: number) => {
    const newList = (localProfile[field] as string[]).filter((_, i) => i !== index);
    const updated = { ...localProfile, [field]: newList };
    setLocalProfile(updated);
    onSave(updated); // Immediate save for list items
  };

  const toggleSoftSkill = (skill: string) => {
    const newList = (localProfile.softSkills || []).includes(skill)
      ? localProfile.softSkills.filter(s => s !== skill)
      : [...(localProfile.softSkills || []), skill];
    const updated = { ...localProfile, softSkills: newList };
    setLocalProfile(updated);
    onSave(updated); // Immediate save for list items
  };

  const careerGoalOptions = [
    'Software Engineer', 'AI/ML Engineer', 'Data Analyst', 
    'Full Stack Developer', 'Data Scientist', 'Cybersecurity Analyst', 'Other'
  ];

  const loadDemoProfile = () => {
    const demo: StudentProfile = {
      name: 'Alex Johnson',
      degree: 'B.Tech',
      branch: 'Computer Science',
      year: 'Third Year',
      cgpa: '9.2',
      technicalSkills: ['Python', 'Java', 'HTML', 'CSS', 'SQL'],
      softSkills: ['Problem-solving', 'Teamwork', 'Communication'],
      interests: ['Artificial Intelligence', 'Machine Learning'],
      careerGoal: 'AI/ML Engineer',
      projects: 'Weather Application, Sign Language Detection',
      experience: 'Summer Internship at Tech Corp',
      certifications: 'Google IT Support Professional',
      improvements: 'Deep Learning concepts'
    };
    setLocalProfile(demo);
    onSave(demo);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Build Your Career Profile</h1>
          <p className="text-slate-500">Provide your details to get a personalized career blueprint.</p>
          <p className="text-xs text-slate-400 mt-1 italic">* Indicates a required field</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors border border-slate-200"
          >
            <Info size={16} className="text-indigo-600" />
            {showGuide ? 'Hide Entry Guide' : 'Show Entry Guide'}
          </button>
          <button 
            type="button"
            onClick={loadDemoProfile}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors border border-indigo-200"
          >
            Load Demo Profile
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${showGuide ? 'lg:grid-cols-3' : ''} gap-8`}>
        <div className={showGuide ? 'lg:col-span-2 space-y-8' : 'space-y-8 max-w-4xl mx-auto w-full'}>
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

            {/* Personal & Academic */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Academic Background</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name*
                  </label>
                  <input 
                    type="text" 
                    value={localProfile.name}
                    onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                    onBlur={handleSave}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Degree / Course*
                  </label>
                  <input 
                    list="degrees"
                    type="text" 
                    value={localProfile.degree}
                    onChange={(e) => setLocalProfile({...localProfile, degree: e.target.value})}
                    onBlur={handleSave}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g., B.Tech, B.S."
                  />
                  <datalist id="degrees">
                    <option value="B.Tech" />
                    <option value="B.E." />
                    <option value="B.S. (Computer Science)" />
                    <option value="B.C.A." />
                    <option value="M.Tech" />
                    <option value="M.S." />
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Branch / Specialization*
                  </label>
                  <input 
                    list="branches"
                    type="text" 
                    value={localProfile.branch}
                    onChange={(e) => setLocalProfile({...localProfile, branch: e.target.value})}
                    onBlur={handleSave}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g., Computer Science"
                  />
                  <datalist id="branches">
                    <option value="Computer Science" />
                    <option value="Artificial Intelligence" />
                    <option value="Data Science" />
                    <option value="Information Technology" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Current Year
                  </label>
                  <select 
                    value={localProfile.year}
                    onChange={(e) => {
                      const updated = {...localProfile, year: e.target.value};
                      setLocalProfile(updated);
                      onSave(updated); // Select changes are immediate
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white text-slate-900"
                  >
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CGPA
                  </label>
                  <input 
                    type="text" 
                    value={localProfile.cgpa}
                    onChange={(e) => setLocalProfile({...localProfile, cgpa: e.target.value})}
                    onBlur={handleSave}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g., 9.2 or 3.8"
                  />
                </div>
              </div>
            </section>

            {/* Technical Skills */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Technical Skills*
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(localProfile.technicalSkills || []).map((skill, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium group">
                    {skill}
                    <button type="button" onClick={() => removeItem('technicalSkills', i)} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('technicalSkills', newSkill))}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g., Python, SQL, React"
                />
                <button 
                  type="button"
                  onClick={() => handleAddItem('technicalSkills', newSkill)}
                  className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </section>

            {/* Soft Skills */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Soft Skills
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Communication', 'Leadership', 'Problem-solving', 
                  'Teamwork', 'Creativity', 'Time management', 
                  'Adaptability', 'Critical Thinking'
                ].map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSoftSkill(skill)}
                    className={`
                      px-4 py-2 rounded-lg border text-xs font-medium transition-all
                      ${(localProfile.softSkills || []).includes(skill)
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}
                    `}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </section>

            {/* Interests */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Specialized Interests
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(localProfile.interests || []).map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    {item}
                    <button type="button" onClick={() => removeItem('interests', i)} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g., AI Research, IoT"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('interests', newInterest))}
                />
                <button 
                  type="button"
                  onClick={() => handleAddItem('interests', newInterest)}
                  className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </section>

            {/* Career Goal */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Career Goal
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {careerGoalOptions.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => {
                      const updated = {...localProfile, careerGoal: goal};
                      setLocalProfile(updated);
                      onSave(updated); // Immediate save for goal change
                    }}
                    className={`
                      px-4 py-2 rounded-lg border text-xs font-medium transition-all
                      ${localProfile.careerGoal === goal
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}
                    `}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </section>

            {/* Experience & Aspirations */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Experience & Projects</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Key Projects
                  </label>
                  <textarea 
                    value={localProfile.projects}
                    onChange={(e) => setLocalProfile({...localProfile, projects: e.target.value})}
                    onBlur={handleSave}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 text-sm"
                    placeholder="e.g., Describe 2-3 key apps..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Experience
                    </label>
                    <input 
                      type="text" 
                      value={localProfile.experience}
                      onChange={(e) => setLocalProfile({...localProfile, experience: e.target.value})}
                      onBlur={handleSave}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g., 3 months at Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Certifications
                    </label>
                    <input 
                      type="text" 
                      value={localProfile.certifications}
                      onChange={(e) => setLocalProfile({...localProfile, certifications: e.target.value})}
                      onBlur={handleSave}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g., AWS Developer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Target Areas for Improvement
                  </label>
                  <textarea 
                    value={localProfile.improvements}
                    onChange={(e) => setLocalProfile({...localProfile, improvements: e.target.value})}
                    onBlur={handleSave}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-20 text-sm"
                    placeholder="e.g., Advanced DSA, Cloud infrastructure..."
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleSave}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border rounded-xl font-bold transition-all shadow-sm ${
                  saveStatus === 'saved' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {saveStatus === 'saved' ? (
                  <>
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    Profile Saved Locally
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Profile
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={isGenerating || !localProfile.name || !localProfile.technicalSkills.length}
                onClick={() => onGenerate(localProfile)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all shadow-md
                  ${isGenerating || !localProfile.name || !localProfile.technicalSkills.length
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                `}
              >
                <Sparkles size={20} />
                {isGenerating ? 'Generating...' : 'Generate Career Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Profile Guide Sidebar */}
        {showGuide && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info size={18} className="text-indigo-600" />
                Profile Config Guide
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-3">Critical Fields</h4>
                  <div className="space-y-4">
                    {fieldGuides[0].items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-1 h-1 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Optional Booster</h4>
                  <div className="space-y-4">
                    {fieldGuides[1].items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{item.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
