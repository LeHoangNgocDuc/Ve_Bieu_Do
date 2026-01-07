
import { PatternType } from './types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const DEFAULT_COLORS = [
  '#14b8a6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#6366f1', '#06b6d4', '#f97316'
];

export const PATTERNS: PatternType[] = [
  'none', 'lines-h', 'lines-v', 'grid', 'dots', 'diagonal', 
  'zigzag', 'waves', 'bricks', 'hexagons', 'checks', 
  'triangles', 'circles', 'plus', 'cross', 'diagonal-rev'
];

export const STROKE_STYLES = ['solid', 'dashed', 'dotted'];
