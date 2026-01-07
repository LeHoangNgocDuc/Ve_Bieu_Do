
export type ShapeType = 'line' | 'circle' | 'polygon' | 'text' | 'pie-slice' | 'bar' | 'polyline';

export enum StrokeStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted'
}

export type PatternType = 
  | 'none' | 'lines-h' | 'lines-v' | 'grid' | 'dots' | 'diagonal' 
  | 'zigzag' | 'waves' | 'bricks' | 'hexagons' | 'checks' 
  | 'triangles' | 'circles' | 'plus' | 'cross' | 'diagonal-rev' | 'stars';

export interface Point {
  x: number;
  y: number;
}

export interface BaseShape {
  id: string;
  type: ShapeType;
  color: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  pattern: PatternType;
  label?: string;
}

export interface LineShape extends BaseShape {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PolylineShape extends BaseShape {
  type: 'polyline';
  points: Point[];
  fill: string;
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
}

export interface PolygonShape extends BaseShape {
  type: 'polygon';
  points: Point[];
}

export interface TextShape extends BaseShape {
  type: 'text';
  x: number;
  y: number;
  content: string;
  fontSize: number;
  fontWeight?: string;
  textAnchor?: 'start' | 'middle' | 'end';
}

export interface PieSliceShape extends BaseShape {
  type: 'pie-slice';
  cx: number;
  cy: number;
  r: number;
  startAngle: number;
  endAngle: number;
  percent: number;
}

export interface BarShape extends BaseShape {
  type: 'bar';
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
}

export type Shape = LineShape | CircleShape | PolygonShape | TextShape | PieSliceShape | BarShape | PolylineShape;

export interface ChartData {
  id: string;
  label: string;
  value: number;
  value2?: number; // Cho cột kép hoặc đoạn thẳng thứ 2
  color: string;
  color2?: string;
}

export type AppTab = 'geometry' | 'pie' | 'bar' | 'double-bar' | 'line-chart';
