
import { 
  CHICKEN_EGG_FRAMES, 
  CHICKEN_CRACKED_FRAMES, 
  CHICKEN_BABY_FRAMES, 
  CHICKEN_TEEN_FRAMES, 
  CHICKEN_ADULT_FRAMES 
} from './chicken';
import { PET_GHOST_24 } from './ghost';

/**
 * MAPPING DỮ LIỆU CỤ THỂ SANG GIAI ĐOẠN CHUNG
 * Hiện tại đang dùng Gà (Chicken 24x24) làm mặc định.
 * Các biến STAGE_X sẽ là một mảng các frames (3D array) thay vì 1 frame (2D array).
 */

export const STAGE_1_EGG = CHICKEN_EGG_FRAMES;
export const STAGE_2_CRACKED = CHICKEN_CRACKED_FRAMES;
export const STAGE_3_BABY = CHICKEN_BABY_FRAMES;
export const STAGE_4_TEEN = CHICKEN_TEEN_FRAMES;
export const STAGE_5_ADULT = CHICKEN_ADULT_FRAMES;

// Ghost (24x24) - Bọc trong mảng để đồng bộ cấu trúc
export const GHOST = [PET_GHOST_24];

// Poop (8x8) - Bọc trong mảng
const POOP_GRID = [
  [0,0,0,0,14,0,0,0], // 14: Highlight
  [0,0,0,13,13,0,0,0], // 13: Brown
  [0,0,13,13,13,13,0,0],
  [0,13,14,13,13,14,13,0], // Highlight ở giữa
  [0,13,13,13,13,13,13,0],
  [13,13,13,13,13,13,13,13],
  [13,13,13,13,13,13,13,13],
  [0,0,0,0,0,0,0,0],
];

export const POOP = [POOP_GRID];
