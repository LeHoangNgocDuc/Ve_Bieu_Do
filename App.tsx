
import React, { useState, useEffect, useMemo } from 'react';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import DrawingCanvas from './components/DrawingCanvas';
import ChartLegend from './components/ChartLegend';
import { AppTab, Shape, ChartData, StrokeStyle, Point, PatternType } from './types';
import { geminiService } from './services/geminiService';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { Volume2, VolumeX, Info, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('geometry');
  const [geometryInput, setGeometryInput] = useState('');
  const [xAxisTitle, setXAxisTitle] = useState('Tên');
  const [yAxisTitle, setYAxisTitle] = useState('Giá trị');
  
  // Style toàn cục cho biểu đồ
  const [chartStrokeWidth, setChartStrokeWidth] = useState(1.5);
  const [chartPrimaryColor, setChartPrimaryColor] = useState('#334155');

  // Nhãn cho các chuỗi dữ liệu (dùng cho Cột kép / Đường)
  const [seriesLabels, setSeriesLabels] = useState<string[]>(['Chuỗi 1', 'Chuỗi 2']);

  const [chartData, setChartData] = useState<ChartData[]>([
    { id: '1', label: 'MAI', value: 4, value2: 6, color: '#334155', color2: '#334155' },
    { id: '2', label: 'LAN', value: 5, value2: 8, color: '#334155', color2: '#334155' },
    { id: '3', label: 'ĐÀO', value: 3, value2: 5, color: '#334155', color2: '#334155' },
    { id: '4', label: 'HÙNG', value: 2, value2: 5, color: '#334155', color2: '#334155' },
    { id: '5', label: 'DŨNG', value: 4, value2: 5, color: '#334155', color2: '#334155' },
    { id: '6', label: 'Mục 6', value: 10, value2: 12, color: '#334155', color2: '#334155' }
  ]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Tính toán Legend Items cho UI và SVG export
  const legendItems = useMemo(() => {
    if (activeTab === 'pie') {
      const patterns: PatternType[] = ['diagonal', 'stars', 'grid', 'dots', 'waves', 'zigzag'];
      return chartData.map((d, i) => ({
        label: d.label,
        color: chartPrimaryColor,
        pattern: patterns[i % patterns.length]
      }));
    } else if (activeTab === 'double-bar') {
      return [
        { label: seriesLabels[0] || 'Chuỗi 1', color: chartPrimaryColor, pattern: 'diagonal' as PatternType },
        { label: seriesLabels[1] || 'Chuỗi 2', color: chartPrimaryColor, pattern: 'stars' as PatternType }
      ];
    } else if (activeTab === 'line-chart') {
      return [
        { label: seriesLabels[0] || 'Dòng 1', color: '#ef4444', pattern: 'lines-h' as PatternType },
        { label: seriesLabels[1] || 'Dòng 2', color: '#3b82f6', pattern: 'lines-v' as PatternType }
      ];
    }
    return [];
  }, [activeTab, chartData, chartPrimaryColor, seriesLabels]);

  // Sinh các hình vẽ cho biểu đồ
  useEffect(() => {
    if (activeTab === 'pie') {
      const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
      const cx = CANVAS_WIDTH / 2;
      const cy = CANVAS_HEIGHT / 2;
      const r = 220; 
      let startAngle = -Math.PI / 2;

      const patterns: PatternType[] = ['diagonal', 'stars', 'grid', 'dots', 'waves', 'zigzag'];
      
      const pieShapes: Shape[] = chartData.map((data, i) => {
        const sliceAngle = (data.value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        
        const slice: Shape = {
          id: `pie-${data.id}`,
          type: 'pie-slice',
          cx, cy, r,
          startAngle,
          endAngle,
          percent: Math.round((data.value / total) * 100),
          color: chartPrimaryColor,
          strokeWidth: chartStrokeWidth,
          strokeStyle: StrokeStyle.SOLID,
          pattern: patterns[i % patterns.length],
          label: data.label
        };
        
        startAngle = endAngle;
        return slice;
      });

      const labels: Shape[] = chartData.map((data, i) => {
        let runningAngle = -Math.PI / 2;
        for(let j=0; j<i; j++) runningAngle += (chartData[j].value / total) * 2 * Math.PI;
        const sliceAngle = (data.value / total) * 2 * Math.PI;
        const midAngle = runningAngle + sliceAngle / 2;
        
        const textDist = r * 0.7; 
        const tx = cx + textDist * Math.cos(midAngle);
        const ty = cy + textDist * Math.sin(midAngle);

        return {
          id: `text-val-${data.id}`,
          type: 'text',
          x: tx,
          y: ty,
          content: `${Math.round((data.value / total) * 100)}%`,
          fontSize: 18,
          fontWeight: 'bold',
          textAnchor: 'middle',
          color: '#000',
          strokeWidth: 0,
          strokeStyle: StrokeStyle.SOLID,
          pattern: 'none'
        } as Shape;
      });

      setShapes([...pieShapes, ...labels]);

    } else if (activeTab === 'bar' || activeTab === 'double-bar') {
      const margin = 100;
      const width = CANVAS_WIDTH - 2 * margin;
      const height = CANVAS_HEIGHT - 2 * margin;
      const maxVal = Math.max(...chartData.flatMap(d => [d.value, d.value2 || 0]), 10);
      const groupWidth = width / chartData.length;
      const isDouble = activeTab === 'double-bar';
      const barWidth = isDouble ? groupWidth * 0.35 : groupWidth * 0.55;

      const axisLines: Shape[] = [
        { id: 'axis-y', type: 'line', x1: margin, y1: margin + height, x2: margin, y2: margin - 40, color: '#1e293b', strokeWidth: 2.5, strokeStyle: StrokeStyle.SOLID, pattern: 'none' },
        { id: 'axis-x', type: 'line', x1: margin, y1: margin + height, x2: margin + width + 60, y2: margin + height, color: '#1e293b', strokeWidth: 2.5, strokeStyle: StrokeStyle.SOLID, pattern: 'none' }
      ];

      const axisLabels: Shape[] = [
        { id: 'axis-lbl-y', type: 'text', x: margin - 15, y: margin - 60, content: yAxisTitle, fontSize: 16, fontWeight: 'bold', color: '#2563eb', textAnchor: 'middle', strokeWidth: 0, strokeStyle: StrokeStyle.SOLID, pattern: 'none' },
        { id: 'axis-lbl-x', type: 'text', x: margin + width + 85, y: margin + height + 5, content: xAxisTitle, fontSize: 16, fontWeight: 'bold', color: '#2563eb', textAnchor: 'middle', strokeWidth: 0, strokeStyle: StrokeStyle.SOLID, pattern: 'none' }
      ];

      const bars: Shape[] = chartData.flatMap((data, i) => {
        const groupCenterX = margin + i * groupWidth + groupWidth / 2;
        const shapesForGroup: Shape[] = [];

        // Bar 1
        const h1 = (data.value / maxVal) * height;
        shapesForGroup.push({
          id: `bar1-${data.id}`,
          type: 'bar',
          x: isDouble ? groupCenterX - barWidth : groupCenterX - barWidth / 2,
          y: margin + height - h1,
          width: barWidth,
          height: h1,
          color: chartPrimaryColor,
          pattern: 'diagonal',
          strokeWidth: chartStrokeWidth,
          strokeStyle: StrokeStyle.SOLID
        } as Shape);

        // Value Label 1
        shapesForGroup.push({
          id: `val1-${data.id}`,
          type: 'text',
          x: isDouble ? groupCenterX - barWidth / 2 : groupCenterX,
          y: margin + height - h1 - 12,
          content: data.value.toString(),
          fontSize: 15,
          fontWeight: 'bold',
          color: '#2563eb',
          textAnchor: 'middle',
          strokeWidth: 0,
          strokeStyle: StrokeStyle.SOLID,
          pattern: 'none'
        } as Shape);

        if (isDouble) {
          const h2 = ((data.value2 || 0) / maxVal) * height;
          shapesForGroup.push({
            id: `bar2-${data.id}`,
            type: 'bar',
            x: groupCenterX,
            y: margin + height - h2,
            width: barWidth,
            height: h2,
            color: chartPrimaryColor,
            pattern: 'stars',
            strokeWidth: chartStrokeWidth,
            strokeStyle: StrokeStyle.SOLID
          } as Shape);

          shapesForGroup.push({
            id: `val2-${data.id}`,
            type: 'text',
            x: groupCenterX + barWidth / 2,
            y: margin + height - h2 - 12,
            content: (data.value2 || 0).toString(),
            fontSize: 15,
            fontWeight: 'bold',
            color: '#2563eb',
            textAnchor: 'middle',
            strokeWidth: 0,
            strokeStyle: StrokeStyle.SOLID,
            pattern: 'none'
          } as Shape);
        }

        // Category Label
        shapesForGroup.push({
          id: `cat-${data.id}`,
          type: 'text',
          x: groupCenterX,
          y: margin + height + 35,
          content: data.label,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000',
          textAnchor: 'middle',
          strokeWidth: 0,
          strokeStyle: StrokeStyle.SOLID,
          pattern: 'none'
        } as Shape);

        return shapesForGroup;
      });

      setShapes([...axisLines, ...axisLabels, ...bars]);

    } else if (activeTab === 'line-chart') {
      const margin = 100;
      const width = CANVAS_WIDTH - 2 * margin;
      const height = CANVAS_HEIGHT - 2 * margin;
      const maxVal = Math.max(...chartData.flatMap(d => [d.value, d.value2 || 0]), 10);
      const stepX = width / (chartData.length - 1);

      const axisLines: Shape[] = [
        { id: 'axis-y', type: 'line', x1: margin, y1: margin + height, x2: margin, y2: margin - 40, color: '#1e293b', strokeWidth: 2.5, strokeStyle: StrokeStyle.SOLID, pattern: 'none' },
        { id: 'axis-x', type: 'line', x1: margin, y1: margin + height, x2: margin + width + 60, y2: margin + height, color: '#1e293b', strokeWidth: 2.5, strokeStyle: StrokeStyle.SOLID, pattern: 'none' }
      ];

      const axisLabels: Shape[] = [
        { id: 'axis-lbl-y', type: 'text', x: margin - 15, y: margin - 60, content: yAxisTitle, fontSize: 16, fontWeight: 'bold', color: '#2563eb', textAnchor: 'middle', strokeWidth: 0, strokeStyle: StrokeStyle.SOLID, pattern: 'none' },
        { id: 'axis-lbl-x', type: 'text', x: margin + width + 85, y: margin + height + 5, content: xAxisTitle, fontSize: 16, fontWeight: 'bold', color: '#2563eb', textAnchor: 'middle', strokeWidth: 0, strokeStyle: StrokeStyle.SOLID, pattern: 'none' }
      ];

      const points1: Point[] = chartData.map((d, i) => ({
        x: margin + i * stepX,
        y: margin + height - (d.value / maxVal) * height
      }));

      const points2: Point[] = chartData.map((d, i) => ({
        x: margin + i * stepX,
        y: margin + height - ((d.value2 || 0) / maxVal) * height
      }));

      const line1: Shape = {
        id: 'line-series-1',
        type: 'polyline',
        points: points1,
        color: '#ef4444',
        strokeWidth: chartStrokeWidth + 2,
        strokeStyle: StrokeStyle.SOLID,
        pattern: 'none',
        fill: 'none'
      };

      const line2: Shape = {
        id: 'line-series-2',
        type: 'polyline',
        points: points2,
        color: '#3b82f6',
        strokeWidth: chartStrokeWidth + 2,
        strokeStyle: StrokeStyle.DASHED,
        pattern: 'none',
        fill: 'none'
      };

      const markers: Shape[] = [
        ...points1.map((p, i) => ({ id: `m1-${i}`, type: 'circle', cx: p.x, cy: p.y, r: 6, color: '#ef4444', strokeWidth: chartStrokeWidth, strokeStyle: StrokeStyle.SOLID, pattern: 'none' } as Shape)),
        ...points2.map((p, i) => ({ id: `m2-${i}`, type: 'circle', cx: p.x, cy: p.y, r: 6, color: '#3b82f6', strokeWidth: chartStrokeWidth, strokeStyle: StrokeStyle.SOLID, pattern: 'none' } as Shape))
      ];

      const catLabels: Shape[] = chartData.map((d, i) => ({
        id: `cat-${d.id}`,
        type: 'text',
        x: margin + i * stepX,
        y: margin + height + 35,
        content: d.label,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#334155',
        textAnchor: 'middle',
        strokeWidth: 0,
        strokeStyle: StrokeStyle.SOLID,
        pattern: 'none'
      } as Shape));

      setShapes([...axisLines, ...axisLabels, line1, line2, ...markers, ...catLabels]);
    }
  }, [activeTab, chartData, xAxisTitle, yAxisTitle, chartStrokeWidth, chartPrimaryColor, seriesLabels]);

  const handleAnalyze = async () => {
    setLoading(true);
    setExplanation('');
    setSelectedId(null);
    try {
      const result = await geminiService.parseGeometry(geometryInput);
      setShapes(result.shapes);
      setExplanation(result.explanation);
      if (isAudioEnabled && result.explanation) {
        await geminiService.speakExplanation(result.explanation);
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra khi gọi AI. Vui lòng kiểm tra API key.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShapeDoubleClick = (shapeId: string) => {
    const shape = shapes.find(s => s.id === shapeId);
    if (!shape) return;

    if (shape.type === 'text') {
      const newContent = window.prompt('Nhập nội dung mới:', shape.content);
      if (newContent === null) return;

      if (shapeId === 'axis-lbl-x') {
        setXAxisTitle(newContent);
        return;
      }
      if (shapeId === 'axis-lbl-y') {
        setYAxisTitle(newContent);
        return;
      }

      const catMatch = shapeId.match(/cat-(.*)/);
      if (catMatch) {
        const dataId = catMatch[1];
        setChartData(prev => prev.map(item => item.id === dataId ? { ...item, label: newContent } : item));
        return;
      }

      const val1Match = shapeId.match(/val1-(.*)/);
      if (val1Match) {
        const dataId = val1Match[1];
        const val = parseFloat(newContent);
        if (!isNaN(val)) {
          setChartData(prev => prev.map(item => item.id === dataId ? { ...item, value: val } : item));
        }
        return;
      }

      const val2Match = shapeId.match(/val2-(.*)/);
      if (val2Match) {
        const dataId = val2Match[1];
        const val = parseFloat(newContent);
        if (!isNaN(val)) {
          setChartData(prev => prev.map(item => item.id === dataId ? { ...item, value2: val } : item));
        }
        return;
      }

      setShapes(prev => prev.map(s => s.id === shapeId ? { ...s, content: newContent } : s) as Shape[]);
    }
  };

  const handleLegendDoubleClick = (index: number) => {
    const currentLabel = legendItems[index].label;
    const newContent = window.prompt('Nhập nội dung chú thích mới:', currentLabel);
    if (newContent === null || !newContent.trim()) return;

    if (activeTab === 'pie') {
      // Cho biểu đồ tròn, chú thích liên kết trực tiếp với label của data
      setChartData(prev => prev.map((d, i) => i === index ? { ...d, label: newContent } : d));
    } else {
      // Cho cột kép và đường, cập nhật seriesLabels
      setSeriesLabels(prev => {
        const next = [...prev];
        next[index] = newContent;
        return next;
      });
    }
  };

  const updateSelectedShape = (updates: Partial<Shape>) => {
    if (!selectedId) return;
    
    if (activeTab !== 'geometry') {
      if (updates.color) {
        setChartPrimaryColor(updates.color);
        setChartData(prev => prev.map(d => ({ ...d, color: updates.color!, color2: updates.color })));
      }
      if (updates.strokeWidth !== undefined) {
        setChartStrokeWidth(updates.strokeWidth);
      }
    }

    setShapes(prev => prev.map(s => s.id === selectedId ? { ...s, ...updates } : s) as Shape[]);
  };

  const selectedShape = shapes.find(s => s.id === selectedId) || null;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <SidebarLeft 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        geometryInput={geometryInput}
        setGeometryInput={setGeometryInput}
        chartData={chartData}
        setChartData={setChartData}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      <main className="flex-1 flex flex-col min-w-0 p-6 space-y-4 overflow-y-auto">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
              <span>{
                activeTab === 'geometry' ? 'Vẽ Hình Học AI' : 
                activeTab === 'pie' ? 'Biểu Đồ Hình Quạt' : 
                activeTab === 'double-bar' ? 'Biểu Đồ Cột Kép' :
                activeTab === 'line-chart' ? 'Biểu Đồ Đoạn Thẳng' : 'Biểu Đồ Cột Đơn'
              }</span>
              <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            </h2>
            <p className="text-sm text-slate-500 font-medium italic">
              Kích đúp nhãn hoặc chú thích để sửa nội dung.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-2 rounded-full transition-all ${isAudioEnabled ? 'bg-teal-500/10 text-teal-400' : 'bg-slate-800 text-slate-500'}`}
              title={isAudioEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
              <Info size={20} />
            </button>
          </div>
        </header>

        <DrawingCanvas 
          shapes={shapes} 
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDoubleClick={handleShapeDoubleClick}
          legendItems={activeTab !== 'geometry' ? legendItems : []}
          onLegendDoubleClick={handleLegendDoubleClick}
        />

        {activeTab !== 'geometry' && (
          <ChartLegend 
            items={legendItems} 
            onDoubleClick={handleLegendDoubleClick}
          />
        )}

        {explanation && activeTab === 'geometry' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2 flex items-center space-x-2">
              <Sparkles size={12} />
              <span>Phân tích bài toán</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {explanation}
            </p>
          </div>
        )}
      </main>

      <SidebarRight 
        selectedShape={selectedShape}
        onUpdate={updateSelectedShape}
      />
    </div>
  );
};

export default App;
