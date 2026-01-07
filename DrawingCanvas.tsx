
import React, { useRef } from 'react';
import { Shape, Point, PatternType } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import PatternDefs from './PatternDefs';
import { Download } from 'lucide-react';

interface LegendItem {
  label: string;
  pattern: PatternType;
  color: string;
}

interface DrawingCanvasProps {
  shapes: Shape[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDoubleClick: (id: string) => void;
  legendItems?: LegendItem[];
  onLegendDoubleClick?: (index: number) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  shapes, 
  selectedId, 
  onSelect, 
  onDoubleClick, 
  legendItems = [],
  onLegendDoubleClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // SVG Height adjustment for legend
  const hasLegend = legendItems.length > 0;
  const legendHeight = hasLegend ? 80 : 0;
  const totalViewHeight = CANVAS_HEIGHT + legendHeight;

  const getStrokeDashArray = (style: string) => {
    switch (style) {
      case 'dashed': return '8,4';
      case 'dotted': return '2,2';
      default: return 'none';
    }
  };

  const getFill = (shape: Shape) => {
    if (shape.pattern && shape.pattern !== 'none') {
      return `url(#${shape.pattern})`;
    }
    return shape.color;
  };

  const downloadPNG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = CANVAS_WIDTH;
      canvas.height = totalViewHeight;
      if (ctx) {
        ctx.fillStyle = '#ffffff'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'chart-export.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const renderShape = (shape: Shape) => {
    const isSelected = selectedId === shape.id;
    const commonProps = {
      key: shape.id,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(shape.id);
      },
      onDoubleClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onDoubleClick(shape.id);
      },
      style: { cursor: 'pointer', color: shape.color },
      stroke: isSelected ? '#fbbf24' : shape.color,
      strokeWidth: isSelected ? Math.max(shape.strokeWidth + 2, 4) : shape.strokeWidth,
      strokeDasharray: getStrokeDashArray(shape.strokeStyle),
      fill: ['line', 'polyline'].includes(shape.type) ? 'none' : getFill(shape),
      className: `transition-all duration-200 ${isSelected ? 'filter drop-shadow-md' : ''}`
    };

    switch (shape.type) {
      case 'line':
        return <line {...commonProps} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} markerEnd={shape.id.includes('axis') ? "url(#arrow)" : undefined} />;
      case 'polyline':
        const polyPoints = (shape as any).points.map((p: Point) => `${p.x},${p.y}`).join(' ');
        return <polyline {...commonProps} points={polyPoints} fill="none" strokeLinejoin="round" strokeLinecap="round" />;
      case 'circle':
        return <circle {...commonProps} cx={shape.cx} cy={shape.cy} r={shape.r} />;
      case 'polygon':
        const pointsStr = (shape as any).points.map((p: Point) => `${p.x},${p.y}`).join(' ');
        return <polygon {...commonProps} points={pointsStr} />;
      case 'text':
        const isPercentage = shape.id.includes('text-val');
        return (
          <g key={shape.id}>
            {isPercentage && (
               <text 
                x={shape.x} 
                y={shape.y} 
                fontSize={shape.fontSize || 16} 
                fill="white"
                stroke="white"
                strokeWidth="4"
                fontWeight="bold"
                textAnchor={(shape as any).textAnchor || 'start'}
                style={{ pointerEvents: 'none' }}
              >
                {shape.content}
              </text>
            )}
            <text 
              {...commonProps} 
              x={shape.x} 
              y={shape.y} 
              fontSize={shape.fontSize || 16} 
              fill={isSelected ? '#fbbf24' : (isPercentage ? '#000' : shape.color)}
              fontWeight={(shape as any).fontWeight || 'normal'}
              textAnchor={(shape as any).textAnchor || 'start'}
              stroke="none"
            >
              {shape.content}
            </text>
          </g>
        );
      case 'pie-slice':
        const x1 = shape.cx + shape.r * Math.cos(shape.startAngle);
        const y1 = shape.cy + shape.r * Math.sin(shape.startAngle);
        const x2 = shape.cx + shape.r * Math.cos(shape.endAngle);
        const y2 = shape.cy + shape.r * Math.sin(shape.endAngle);
        const largeArcFlag = shape.endAngle - shape.startAngle <= Math.PI ? "0" : "1";
        const d = `M ${shape.cx} ${shape.cy} L ${x1} ${y1} A ${shape.r} ${shape.r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        return <path {...commonProps} d={d} />;
      case 'bar':
        return <rect {...commonProps} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx="2" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative group bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-4">
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_WIDTH} ${totalViewHeight}`} 
        className="w-full h-full max-w-full bg-white shadow-inner rounded-lg"
        onClick={() => onSelect(null)}
      >
        <PatternDefs />
        <rect width={CANVAS_WIDTH} height={totalViewHeight} fill="white" />
        
        <g stroke="#f1f5f9" strokeWidth="0.5">
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 50} x2={CANVAS_WIDTH} y2={i * 50} strokeDasharray="4,4" />
          ))}
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2={CANVAS_HEIGHT} strokeDasharray="4,4" />
          ))}
        </g>
        
        {shapes.map(renderShape)}

        {hasLegend && (
          <g transform={`translate(50, ${CANVAS_HEIGHT + 20})`}>
             <text x="0" y="5" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="start">CHÚ THÍCH (Kích đúp để sửa):</text>
             {legendItems.map((item, i) => (
               <g 
                key={i} 
                transform={`translate(${80 + i * 140}, 0)`} 
                style={{ cursor: 'pointer' }}
                onDoubleClick={() => onLegendDoubleClick?.(i)}
              >
                 {/* Hit Area - Makes the whole legend item clickable even between box and text */}
                 <rect width="130" height="30" y="-5" fill="transparent" />
                 <rect width="20" height="20" fill={`url(#${item.pattern})`} stroke="#cbd5e1" strokeWidth="1" style={{ color: item.color }} />
                 <text x="28" y="15" fontSize="12" fontWeight="bold" fill="#334155">{item.label}</text>
               </g>
             ))}
          </g>
        )}
      </svg>
      
      <button 
        onClick={downloadPNG}
        className="absolute top-8 right-8 bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
        title="Tải xuống hình ảnh (PNG)"
      >
        <Download size={20} />
      </button>

      <div className="absolute bottom-4 left-8 text-[10px] text-slate-500 font-mono">
        {CANVAS_WIDTH}x{totalViewHeight}px
      </div>
    </div>
  );
};

export default DrawingCanvas;
