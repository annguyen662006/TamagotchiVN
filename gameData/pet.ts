import { 
  CHICKEN_EGG_24, 
  CHICKEN_CRACKED_24, 
  CHICKEN_BABY_24, 
  CHICKEN_TEEN_24, 
  CHICKEN_ADULT_24 
} from './chicken';

/**
 * MAPPING DỮ LIỆU CỤ THỂ SANG GIAI ĐOẠN CHUNG
 * Hiện tại đang dùng Gà (Chicken 24x24) làm mặc định.
 * Sau này có thể đổi mapping ở đây để đổi thú cưng.
 */

export const STAGE_1_EGG = CHICKEN_EGG_24;
export const STAGE_2_CRACKED = CHICKEN_CRACKED_24;
export const STAGE_3_BABY = CHICKEN_BABY_24;
export const STAGE_4_TEEN = CHICKEN_TEEN_24;
export const STAGE_5_ADULT = CHICKEN_ADULT_24;

// CÁC THỰC THỂ KHÁC (Giữ nguyên kích thước nhỏ hoặc nâng cấp sau)
// Ghost (8x8)
export const GHOST = [
  [0,0,0,1,1,0,0,0],
  [0,0,1,1,1,1,0,0],
  [0,1,0,1,1,0,1,0],
  [0,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,0],
  [0,1,0,1,0,1,1,0],
  [0,1,0,1,0,1,0,0],
  [0,0,0,0,0,0,0,0],
];

// Poop (8x8)
export const POOP = [
  [0,0,0,0,14,0,0,0], // 14: Highlight
  [0,0,0,13,13,0,0,0], // 13: Brown
  [0,0,13,13,13,13,0,0],
  [0,13,14,13,13,14,13,0], // Highlight ở giữa
  [0,13,13,13,13,13,13,0],
  [13,13,13,13,13,13,13,13],
  [13,13,13,13,13,13,13,13],
  [0,0,0,0,0,0,0,0],
];