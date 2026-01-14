
import React from 'react';

interface PixelGridProps {
  grid: number[][];
  color?: string; // Fallback color or override
  className?: string;
  size?: number;
}

// Color Palette based on user specification
const PALETTE: Record<number, string> = {
  0: 'transparent',
  1: '#ffffff', // Trắng (Vỏ trứng)
  2: '#facc15', // Vàng (Thân gà con - Yellow-400)
  3: '#f97316', // Cam (Mỏ, Chân - Orange-500)
  4: '#ef4444', // Đỏ (Mào - Red-500)
  5: '#1c1917', // Đen/Nâu Đậm (Mắt, Đuôi - Stone-900)
  6: '#a94411', // Nâu (Thân gà lớn - Custom Brown)
  
  // Environment Colors
  7: '#228B22',  // Xanh lá đậm (Lá già, viền cây)
  8: '#32CD32',  // Xanh lá non (Cỏ, lá non)
  9: '#8B4513',  // Nâu gỗ (Thân cây)
  10: '#FF69B4', // Hồng (Cánh hoa)
  11: '#E0FFFF', // Xanh nhạt pha trắng (Mây)
  12: '#FFFACD', // Vàng nhạt (Nhuỵ hoa)
  
  // Poop Colors
  13: '#5d4037', // Nâu đậm (Poop)
  14: '#a1887f', // Nâu sáng (Highlight)

  // Ghost Colors (Hệ Tâm linh)
  30: '#F0F8FF', // Trắng xanh nhạt (AliceBlue) - Thân
  31: '#B0C4DE', // Xanh xám nhạt (LightSteelBlue) - Viền
  32: '#708090', // Xanh xám đậm (SlateGray) - Mắt
};

export const PixelGrid: React.FC<PixelGridProps> = ({ grid, color, className = "", size = 4 }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            // Determine color: If cell > 0, use Palette. If Palette missing, use prop color.
            const cellColor = cell > 0 ? (PALETTE[cell] || color || '#00ff00') : 'transparent';
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: cellColor,
                }}
                className={cell > 0 ? 'shadow-[0_0_1px_rgba(0,0,0,0.5)]' : ''}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};