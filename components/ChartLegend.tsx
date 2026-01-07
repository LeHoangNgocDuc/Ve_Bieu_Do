
import React from 'react';
import { PatternType } from '../types';

interface LegendItem {
  label: string;
  pattern: PatternType;
  color: string;
}

interface ChartLegendProps {
  items: LegendItem[];
}

const ChartLegend: React.FC<ChartLegendProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl mt-4 animate-in fade-in slide-in-from-bottom-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-2">Chú thích:</span>
      {items.map((item, i) => (
        <div key={i} className="flex items-center space-x-3 group cursor-default">
          <div className="relative w-8 h-8 rounded-lg border border-slate-700 overflow-hidden bg-white shadow-sm transition-transform group-hover:scale-110">
             <svg width="100%" height="100%" viewBox="0 0 40 40">
                <rect width="40" height="40" fill={`url(#${item.pattern})`} stroke="none" style={{ color: item.color }} />
             </svg>
          </div>
          <span className="text-sm font-bold text-slate-300 group-hover:text-teal-400 transition-colors">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
