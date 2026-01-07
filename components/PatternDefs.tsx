
import React from 'react';

const PatternDefs: React.FC = () => {
  return (
    <defs>
      {/* Lines Horizontal */}
      <pattern id="lines-h" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M 0 5 L 10 5" stroke="currentColor" strokeWidth="1" fill="none" />
      </pattern>
      
      {/* Lines Vertical */}
      <pattern id="lines-v" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M 5 0 L 5 10" stroke="currentColor" strokeWidth="1" fill="none" />
      </pattern>
      
      {/* Grid */}
      <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M 10 0 L 0 0 0 10" stroke="currentColor" strokeWidth="1" fill="none" />
      </pattern>
      
      {/* Dots */}
      <pattern id="dots" patternUnits="userSpaceOnUse" width="10" height="10">
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      </pattern>

      {/* Stars Pattern */}
      <pattern id="stars" patternUnits="userSpaceOnUse" width="15" height="15">
        <path d="M 7.5 2 L 9 6 L 13 6 L 10 9 L 11 13 L 7.5 11 L 4 13 L 5 9 L 2 6 L 6 6 Z" fill="currentColor" transform="scale(0.8)" />
      </pattern>
      
      {/* Diagonal */}
      <pattern id="diagonal" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" strokeWidth="1" />
      </pattern>

      {/* Diagonal Reversed */}
      <pattern id="diagonal-rev" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M-1,9 l2,2 M0,0 l10,10 M9,-1 l2,2" stroke="currentColor" strokeWidth="1" />
      </pattern>

      {/* Zigzag */}
      <pattern id="zigzag" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M 0 5 L 5 0 L 10 5 L 5 10 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      </pattern>

      {/* Waves */}
      <pattern id="waves" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M 0 5 Q 2.5 0 5 5 T 10 5" stroke="currentColor" strokeWidth="1" fill="none" />
      </pattern>

      {/* Bricks */}
      <pattern id="bricks" patternUnits="userSpaceOnUse" width="20" height="10">
        <rect width="20" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 10 0 L 10 10" stroke="currentColor" strokeWidth="1" />
      </pattern>

      {/* Hexagons */}
      <pattern id="hexagons" patternUnits="userSpaceOnUse" width="18" height="10.4">
        <path d="M 0 5.2 L 3 0 L 9 0 L 12 5.2 L 9 10.4 L 3 10.4 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      </pattern>

      {/* Checks */}
      <pattern id="checks" patternUnits="userSpaceOnUse" width="10" height="10">
        <rect width="5" height="5" fill="currentColor" />
        <rect x="5" y="5" width="5" height="5" fill="currentColor" />
      </pattern>

      {/* Triangles */}
      <pattern id="triangles" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M 5 0 L 10 10 L 0 10 Z" fill="currentColor" />
      </pattern>

      {/* Circles */}
      <pattern id="circles" patternUnits="userSpaceOnUse" width="12" height="12">
        <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
      </pattern>

      {/* Plus */}
      <pattern id="plus" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M 5 2 L 5 8 M 2 5 L 8 5" stroke="currentColor" strokeWidth="1" />
      </pattern>

      {/* Cross */}
      <pattern id="cross" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M 2 2 L 8 8 M 8 2 L 2 8" stroke="currentColor" strokeWidth="1" />
      </pattern>

      {/* Enhanced Arrow Marker for Axes - Darker and Sharper */}
      <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 Z" fill="#1e293b" />
      </marker>
    </defs>
  );
};

export default PatternDefs;
