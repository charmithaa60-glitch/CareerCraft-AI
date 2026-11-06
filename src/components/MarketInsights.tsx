/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Newspaper, 
  TrendingUp,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentProfile } from '../types';

interface Props {
  profile: StudentProfile | null;
}

export default function MarketInsights({ profile }: Props) {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      simulateFetchNews();
    }
  }, [profile?.careerGoal]);

  const simulateFetchNews = () => {
    setLoading(true);
    // Simulate API latency
    setTimeout(() => {
      const mockNews = [
        {
          id: 1,
          title: `Rising Demand for ${profile?.careerGoal} Roles in 2026`,
          source: "Industry Tech Daily",
          date: "2 hours ago",
          description: "Major tech hubs report a 25% increase in job postings for specialized engineering roles. Remote work remains a key benefit for candidates."
        },
        {
          id: 2,
          title: `Key Skill Trends for ${profile?.branch || 'Tech'} Graduates`,
          source: "Career Builder Insight",
          date: "5 hours ago",
          description: "New report highlights the importance of hybrid skills combining technical expertise with strong analytical capabilities."
        },
        {
          id: 3,
          title: "The Impact of AI on Entry-Level Hiring",
          source: "Global Talent Review",
          date: "1 day ago",
          description: "Recruiters are looking for candidates who can leverage AI tools to increase productivity. Prompt engineering becomes a sought-after sub-skill."
        }
      ];
      setNews(mockNews);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Simulated News Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-indigo-600">
            <Newspaper size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Latest Industry News</h2>
            <p className="text-slate-500 text-sm">Real-time trends for {profile?.careerGoal || 'your target career'}.</p>
          </div>
        </div>

        {!profile ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <TrendingUp size={32} />
            </div>
            <p className="text-slate-500 mb-6">Complete your profile to see targeted news and trends.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Fetching the latest tech headlines...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
                    {item.source}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(item.title)}`, '_blank');
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-900 uppercase tracking-widest group-hover:gap-2 transition-all hover:text-indigo-600"
                >
                  Read Full Article <ExternalLink size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
