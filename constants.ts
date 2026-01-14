import { GiaiDoan, LoaiThu } from './types';
import { STAGE_1_EGG, STAGE_2_CRACKED, STAGE_3_BABY, STAGE_4_TEEN, STAGE_5_ADULT, GHOST, POOP } from './gameData/pet';
import { PHOENIX_EGG, PHOENIX_CRACKED, PHOENIX_BABY, PHOENIX_TEEN, PHOENIX_ADULT } from './gameData/phoenix';
import { DRAGON_EGG, DRAGON_BABY, DRAGON_ADULT } from './gameData/dragon';
import { FOREST_EGG, FOREST_CRACKED, FOREST_BABY, FOREST_TEEN, FOREST_ADULT } from './gameData/treant';

// Re-export everything for compatibility
export * from './gameData/config';
export * from './gameData/sky';
export * from './gameData/plants';
export * from './gameData/pet';

// Mapping frames for Chicken
const CHICKEN_FRAMES = {
  [GiaiDoan.TRUNG]: { IDLE: STAGE_1_EGG, HAPPY: STAGE_1_EGG },
  [GiaiDoan.NUT_VO]: { IDLE: STAGE_2_CRACKED, HAPPY: STAGE_2_CRACKED },
  [GiaiDoan.SO_SINH]: { IDLE: STAGE_3_BABY, HAPPY: STAGE_3_BABY },
  [GiaiDoan.THIEU_NIEN]: { IDLE: STAGE_4_TEEN, HAPPY: STAGE_4_TEEN },
  [GiaiDoan.TRUONG_THANH]: { IDLE: STAGE_5_ADULT, HAPPY: STAGE_5_ADULT },
  [GiaiDoan.HON_MA]: { IDLE: GHOST, HAPPY: GHOST },
  POOP: POOP
};

// Mapping frames for Phoenix
const PHOENIX_FRAMES = {
  [GiaiDoan.TRUNG]: { IDLE: PHOENIX_EGG, HAPPY: PHOENIX_EGG },
  [GiaiDoan.NUT_VO]: { IDLE: PHOENIX_CRACKED, HAPPY: PHOENIX_CRACKED },
  [GiaiDoan.SO_SINH]: { IDLE: PHOENIX_BABY, HAPPY: PHOENIX_BABY },
  [GiaiDoan.THIEU_NIEN]: { IDLE: PHOENIX_TEEN, HAPPY: PHOENIX_TEEN }, 
  [GiaiDoan.TRUONG_THANH]: { IDLE: PHOENIX_ADULT, HAPPY: PHOENIX_ADULT },
  [GiaiDoan.HON_MA]: { IDLE: GHOST, HAPPY: GHOST },
  POOP: POOP
};

// Mapping frames for Ice Dragon
const DRAGON_FRAMES = {
  [GiaiDoan.TRUNG]: { IDLE: DRAGON_EGG, HAPPY: DRAGON_EGG },
  [GiaiDoan.NUT_VO]: { IDLE: DRAGON_EGG, HAPPY: DRAGON_EGG },
  [GiaiDoan.SO_SINH]: { IDLE: DRAGON_BABY, HAPPY: DRAGON_BABY },
  [GiaiDoan.THIEU_NIEN]: { IDLE: DRAGON_BABY, HAPPY: DRAGON_BABY }, 
  [GiaiDoan.TRUONG_THANH]: { IDLE: DRAGON_ADULT, HAPPY: DRAGON_ADULT },
  [GiaiDoan.HON_MA]: { IDLE: GHOST, HAPPY: GHOST },
  POOP: POOP
};

// Mapping frames for Forest Guardian (Treant)
const TREANT_FRAMES = {
  [GiaiDoan.TRUNG]: { IDLE: FOREST_EGG, HAPPY: FOREST_EGG },
  [GiaiDoan.NUT_VO]: { IDLE: FOREST_CRACKED, HAPPY: FOREST_CRACKED },
  [GiaiDoan.SO_SINH]: { IDLE: FOREST_BABY, HAPPY: FOREST_BABY },
  [GiaiDoan.THIEU_NIEN]: { IDLE: FOREST_TEEN, HAPPY: FOREST_TEEN }, 
  [GiaiDoan.TRUONG_THANH]: { IDLE: FOREST_ADULT, HAPPY: FOREST_ADULT },
  [GiaiDoan.HON_MA]: { IDLE: GHOST, HAPPY: GHOST },
  POOP: POOP
};

// Master Frame Object
export const PET_FRAMES = {
  'GA': CHICKEN_FRAMES,
  'PHUONG_HOANG': PHOENIX_FRAMES,
  'RONG_BANG': DRAGON_FRAMES,
  'THAN_RUNG': TREANT_FRAMES
};

// Keep the old FRAMES export for backward compatibility if needed, aliasing to Chicken
export const FRAMES = CHICKEN_FRAMES;