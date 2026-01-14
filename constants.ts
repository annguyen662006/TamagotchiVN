
import { GiaiDoan, LoaiThu } from './types';
import { STAGE_1_EGG, STAGE_2_CRACKED, STAGE_3_BABY, STAGE_4_TEEN, STAGE_5_ADULT, GHOST, POOP } from './gameData/pet';
import { PHOENIX_EGG, PHOENIX_BABY, PHOENIX_ADULT } from './gameData/phoenix';

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
  [GiaiDoan.NUT_VO]: { IDLE: PHOENIX_EGG, HAPPY: PHOENIX_EGG }, // Phoenix egg cracks visually via shake animation or similar
  [GiaiDoan.SO_SINH]: { IDLE: PHOENIX_BABY, HAPPY: PHOENIX_BABY },
  [GiaiDoan.THIEU_NIEN]: { IDLE: PHOENIX_BABY, HAPPY: PHOENIX_BABY }, // Map Teen to Baby temporarily (or Adult) as user only provided 3 stages
  [GiaiDoan.TRUONG_THANH]: { IDLE: PHOENIX_ADULT, HAPPY: PHOENIX_ADULT },
  [GiaiDoan.HON_MA]: { IDLE: GHOST, HAPPY: GHOST },
  POOP: POOP
};

// Master Frame Object
export const PET_FRAMES = {
  'GA': CHICKEN_FRAMES,
  'PHUONG_HOANG': PHOENIX_FRAMES
};

// Keep the old FRAMES export for backward compatibility if needed, aliasing to Chicken
export const FRAMES = CHICKEN_FRAMES;
