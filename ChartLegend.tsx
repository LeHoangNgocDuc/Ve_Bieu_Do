
import React, { useState, useRef, useEffect } from 'react';
import { PatternType } from '../types';

interface LegendItem {
  label: string;
  pattern: PatternType;
  color: string;
}

interface ChartLegendProps {
  items: LegendItem[];
  onUpdateLabel?: (index: number, newLabel: string) => void;
}

const ChartLegend: React.FC<ChartLegendProps> = ({ items, onUpdateLabel }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Tự động focus và bôi đen văn bản khi bắt đầu sửa
  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIndex]);

  if (items.length === 0) return null;

  const handleStartEdit = (e: React.MouseEvent, index: number, label: string) => {
    e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
    setEditingIndex(index);
    setEditValue(label);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      const trimmedValue = editValue.trim();
      // Nếu không trống và khác với giá trị cũ thì mới cập nhật
      if (trimmedValue && trimmedValue !== items[editingIndex].label) {
        onUpdateLabel?.(editingIndex, trimmedValue);
      }
      // Nếu trống, tự động quay về giá trị cũ (đã được xử lý bằng việc không gọi onUpdateLabel)
      setEditingIndex(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl mt-4 animate-in fade-in slide-in-from-bottom-2 shadow-inner">
      <div className="flex items-center space-x-2 border-r border-slate-700 pr-4 mr-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chú thích</span>
        <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">Kích đúp chữ để sửa</span>
      </div>
      
      {items.map((item, i) => (
        <div 
          key={i} 
          className="flex items-center space-x-3 group"
        >
          {/* Biểu tượng Pattern - Không nhận double click để sửa text */}
          <div className="relative w-8 h-8 rounded-lg border border-slate-700 overflow-hidden bg-white shadow-sm transition-transform group-hover:scale-105">
             <svg width="100%" height="100%" viewBox="0 0 40 40">
                <rect width="40" height="40" fill={`url(#${item.pattern})`} stroke="none" style={{ color: item.color }} />
             </svg>
          </div>
          
          <div className="min-w-[60px]">
            {editingIndex === i ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="bg-slate-800 border-b-2 border-teal-500 text-sm font-bold text-teal-400 outline-none w-full py-0 px-1 animate-in zoom-in-95 duration-75 shadow-lg"
              />
            ) : (
              <span 
                onDoubleClick={(e) => handleStartEdit(e, i, item.label)}
                className="text-sm font-bold text-slate-300 group-hover:text-teal-400 transition-colors cursor-text select-none py-1 border-b-2 border-transparent hover:border-slate-700"
                title="Kích đúp để đổi tên"
              >
                {item.label}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
