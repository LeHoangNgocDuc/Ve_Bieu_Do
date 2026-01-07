
import React from 'react';
import { Shape, PatternType, StrokeStyle } from '../types';
import { PATTERNS, STROKE_STYLES } from '../constants';
import { Settings2, Palette, Layers, Grid } from 'lucide-react';

interface SidebarRightProps {
  selectedShape: Shape | null;
  onUpdate: (updates: Partial<Shape>) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ selectedShape, onUpdate }) => {
  if (!selectedShape) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500 space-y-4">
        <div className="bg-slate-800 p-4 rounded-full">
          <Settings2 size={40} className="opacity-20" />
        </div>
        <p className="text-sm font-medium text-center">Chọn một đối tượng trên canvas để tuỳ chỉnh thuộc tính</p>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-slate-800 p-6 space-y-8 overflow-y-auto animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center space-x-2 text-slate-100 border-b border-slate-800 pb-4">
        <Settings2 size={20} className="text-teal-500" />
        <h2 className="text-lg font-bold">Tuỳ Chỉnh</h2>
        <span className="ml-auto text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-400 font-bold uppercase tracking-wider">
          {selectedShape.type}
        </span>
      </div>

      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-slate-400 mb-2">
          <Palette size={14} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Màu sắc & Nét vẽ</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold">Màu sắc</label>
            <div className="flex items-center space-x-2">
              <input 
                type="color" 
                value={selectedShape.color}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="h-10 w-full bg-transparent border-none cursor-pointer p-0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold">Độ dày</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={selectedShape.strokeWidth}
              onChange={(e) => onUpdate({ strokeWidth: parseInt(e.target.value) || 1 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 uppercase font-bold">Kiểu nét</label>
          <div className="flex bg-slate-800 rounded-lg p-1">
            {STROKE_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => onUpdate({ strokeStyle: style as StrokeStyle })}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${selectedShape.strokeStyle === style ? 'bg-slate-700 text-teal-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {style === 'solid' ? 'Liền' : style === 'dashed' ? 'Đứt' : 'Chấm'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {['polygon', 'circle', 'pie-slice', 'bar'].includes(selectedShape.type) && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <Grid size={14} />
            <h3 className="text-xs font-bold uppercase tracking-wider">Hoạ tiết nền (Pattern)</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p}
                onClick={() => onUpdate({ pattern: p as PatternType })}
                title={p}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center relative overflow-hidden transition-all ${selectedShape.pattern === p ? 'border-teal-500 bg-slate-800' : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'}`}
              >
                <svg width="100%" height="100%" viewBox="0 0 40 40">
                  <rect width="40" height="40" fill={p === 'none' ? 'transparent' : `url(#${p})`} stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
                  {p === 'none' && <line x1="10" y1="10" x2="30" y2="30" stroke="currentColor" strokeWidth="1" className="text-red-500/50" />}
                </svg>
                {selectedShape.pattern === p && (
                  <div className="absolute inset-0 bg-teal-500/10 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedShape.type === 'text' && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <Layers size={14} />
            <h3 className="text-xs font-bold uppercase tracking-wider">Nội dung văn bản</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Văn bản</label>
              <input 
                type="text" 
                value={(selectedShape as any).content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Cỡ chữ</label>
              <input 
                type="number" 
                value={(selectedShape as any).fontSize}
                onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 12 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        </section>
      )}

      <div className="pt-6">
        <button 
          onClick={() => onUpdate({ id: selectedShape.id })} // No-op for now, could be delete
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 border border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
        >
          Xóa đối tượng
        </button>
      </div>
    </div>
  );
};

export default SidebarRight;
