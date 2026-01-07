
import React from 'react';
import { AppTab, ChartData } from '../types';
import { Sparkles, Plus, Trash2, PieChart, BarChart3, Triangle, TrendingUp, BarChart } from 'lucide-react';

interface SidebarLeftProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  geometryInput: string;
  setGeometryInput: (val: string) => void;
  chartData: ChartData[];
  setChartData: (data: ChartData[]) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ 
  activeTab, setActiveTab, geometryInput, setGeometryInput, chartData, setChartData, onAnalyze, loading 
}) => {

  const handleAddData = () => {
    const newData: ChartData = {
      id: Math.random().toString(36).substr(2, 9),
      label: `Mục ${chartData.length + 1}`,
      value: 10,
      value2: 15,
      color: '#14b8a6',
      color2: '#3b82f6'
    };
    setChartData([...chartData, newData]);
  };

  const handleUpdateData = (id: string, field: keyof ChartData, value: string | number) => {
    setChartData(chartData.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDeleteData = (id: string) => {
    setChartData(chartData.filter(item => item.id !== id));
  };

  const isMultiSeries = activeTab === 'double-bar' || activeTab === 'line-chart';

  return (
    <div className="w-80 flex flex-col h-full bg-slate-900 border-r border-slate-800 p-4 space-y-6 overflow-y-auto">
      <div className="flex items-center space-x-2 text-teal-500 mb-2">
        <div className="bg-teal-500/10 p-2 rounded-lg">
          <Sparkles size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">SmartDraw AI</h1>
      </div>

      <nav className="grid grid-cols-3 gap-1 bg-slate-800/50 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('geometry')}
          className={`flex flex-col items-center py-2 rounded-lg transition-all ${activeTab === 'geometry' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <Triangle size={16} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">H.Học</span>
        </button>
        <button 
          onClick={() => setActiveTab('pie')}
          className={`flex flex-col items-center py-2 rounded-lg transition-all ${activeTab === 'pie' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <PieChart size={16} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Tròn</span>
        </button>
        <button 
          onClick={() => setActiveTab('bar')}
          className={`flex flex-col items-center py-2 rounded-lg transition-all ${activeTab === 'bar' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <BarChart3 size={16} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Cột Đơn</span>
        </button>
        <button 
          onClick={() => setActiveTab('double-bar')}
          className={`flex flex-col items-center py-2 rounded-lg transition-all ${activeTab === 'double-bar' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <BarChart size={16} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Cột Kép</span>
        </button>
        <button 
          onClick={() => setActiveTab('line-chart')}
          className={`flex flex-col items-center py-2 rounded-lg transition-all ${activeTab === 'line-chart' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <TrendingUp size={16} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Đ.Thẳng</span>
        </button>
      </nav>

      {activeTab === 'geometry' ? (
        <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-left-4">
          <label className="text-sm font-semibold text-slate-300">Mô tả bài toán hình học</label>
          <textarea 
            value={geometryInput}
            onChange={(e) => setGeometryInput(e.target.value)}
            placeholder="Ví dụ: Vẽ tam giác ABC vuông tại A có AB=300, AC=400. Vẽ đường cao AH..."
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
          />
          <button 
            onClick={onAnalyze}
            disabled={loading || !geometryInput.trim()}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>Phân Tích AI</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-left-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-300">Dữ liệu biểu đồ</label>
            <button 
              onClick={handleAddData}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-teal-500 rounded-lg transition-colors"
              title="Thêm dữ liệu"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.id} className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl space-y-2 group">
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateData(item.id, 'label', e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm font-medium text-slate-200 focus:ring-0 p-0"
                    placeholder="Nhãn (ví dụ: MAI)"
                  />
                  <button 
                    onClick={() => handleDeleteData(item.id)}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold w-12">Giá trị 1:</span>
                      <input 
                        type="number"
                        value={item.value}
                        onChange={(e) => handleUpdateData(item.id, 'value', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </div>
                    <input 
                      type="color"
                      value={item.color}
                      onChange={(e) => handleUpdateData(item.id, 'color', e.target.value)}
                      className="w-6 h-6 rounded bg-transparent border-none cursor-pointer p-0"
                    />
                  </div>
                  
                  {isMultiSeries && (
                    <div className="flex items-center space-x-3 animate-in slide-in-from-top-1">
                      <div className="flex-1 flex items-center space-x-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold w-12 text-blue-400">Giá trị 2:</span>
                        <input 
                          type="number"
                          value={item.value2 || 0}
                          onChange={(e) => handleUpdateData(item.id, 'value2', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                        />
                      </div>
                      <input 
                        type="color"
                        value={item.color2 || '#3b82f6'}
                        onChange={(e) => handleUpdateData(item.id, 'color2', e.target.value)}
                        className="w-6 h-6 rounded bg-transparent border-none cursor-pointer p-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
          Powered by Gemini 3.0
        </p>
      </div>
    </div>
  );
};

export default SidebarLeft;
