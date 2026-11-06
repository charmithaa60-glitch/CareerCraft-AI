/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trash2, ExternalLink, Calendar } from 'lucide-react';
import { CareerReport } from '../types';

interface Props {
  reports: CareerReport[];
  onView: (report: CareerReport) => void;
  onDelete: (timestamp: number) => void;
}

export default function SavedReports({ reports, onView, onDelete }: Props) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
        <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No Saved Reports</h3>
        <p className="text-slate-500">Your generated career blueprints will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div key={report.timestamp} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <button 
              onClick={() => onDelete(report.timestamp)}
              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">
            Career Analysis
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {new Date(report.timestamp).toLocaleDateString()} · {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Skill Coverage</span>
              <span className="font-bold text-indigo-600">{report.skillGap.coverage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500" 
                style={{ width: `${report.skillGap.coverage}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={() => onView(report)}
            className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} />
            View Full Report
          </button>
        </div>
      ))}
    </div>
  );
}
