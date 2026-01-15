




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

  // Màu hệ Lửa (Phoenix)
  20: '#8B0000', // Đỏ rượu vang (Màu nền lông, viền tối)
  21: '#FF0000', // Đỏ tươi (Thân chính)
  22: '#FF4500', // Đỏ cam (Cánh, chuyển màu)
  23: '#FFA500', // Cam sáng (Lông đuôi, Mỏ)
  24: '#FFD700', // Vàng kim (Mào, Móng vuốt, Lõi lửa)
  25: '#FFFFFF', // Trắng (Tâm nhiệt độ cao nhất - mắt hoặc lõi ngực)
  26: '#4B0082', // Tím than (Mắt thần, tạo độ sâu bí ẩn)

  // Ghost Colors (Hệ Tâm linh)
  30: '#F0F8FF', // Trắng xanh nhạt (AliceBlue) - Thân
  31: '#B0C4DE', // Xanh xám nhạt (LightSteelBlue) - Viền
  32: '#708090', // Xanh xám đậm (SlateGray) - Mắt

  // Màu hệ Băng (Ice Dragon)
  40: '#00008B', // Xanh dương đậm (Viền, vảy tối)
  41: '#1E90FF', // Xanh dương tươi (Thân chính)
  42: '#00BFFF', // Xanh da trời (Điểm sáng)
  43: '#E0FFFF', // Trắng xanh (Bụng, móng vuốt, băng tuyết)
  44: '#FFFFFF', // Trắng tinh (Mắt, phản quang)
  45: '#483D8B', // Xanh tím than (Gai lưng, sừng)

  // Màu hệ Mộc (Forest Guardian)
  50: '#006400', // Xanh lá đậm (Viền lá, bóng tối)
  51: '#228B22', // Xanh lá cây chuẩn (Thân lá chính)
  52: '#7CFC00', // Xanh lá mạ sáng (Chồi non, điểm sáng)
  53: '#8B4513', // Nâu gỗ đậm (Vỏ hạt, thân cây)
  54: '#D2691E', // Nâu gỗ sáng (Điểm sáng trên thân gỗ)
  55: '#FF69B4', // Hồng (Hoa nở khi trưởng thành - điểm nhấn)

  // --- HỆ ĐIỆN (THUNDER RAIJU) ---
  70: '#4B0082', // Tím than (Nền, bóng tối)
  71: '#9370DB', // Tím nhạt (Lông chính)
  72: '#FFFF00', // Vàng chanh (Tia sét chính)
  73: '#FFFFFF', // Trắng tinh (Lõi sét, mắt)
  74: '#FFA500', // Cam (Tia lửa điện dư thừa)

  // --- HỆ BÓNG TỐI (NIGHTMARE STEED - HẮC MÃ) ---
  80: '#000000', // Đen tuyền (Thân chính)
  81: '#2d3748', // Xám xanh đen (Giáp, Viền)
  82: '#7e22ce', // Tím đậm (Khói, Bờm)
  83: '#ff0055', // Đỏ hồng Neon (Mắt, Lửa ma trơi)
  84: '#4a044e', // Tím đen (Bóng đổ)
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