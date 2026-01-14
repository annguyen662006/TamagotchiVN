import { GiaiDoan } from './types';
import { STAGE_1_EGG, STAGE_2_CRACKED, STAGE_3_BABY, STAGE_4_TEEN, STAGE_5_ADULT, GHOST, POOP } from './gameData/pet';

// Re-export everything for compatibility
export * from './gameData/config';
export * from './gameData/sky';
export * from './gameData/plants';
export * from './gameData/pet';

// Mapping to existing FRAMES structure
// Since we only have static frames for now, we map IDLE and HAPPY to the same grid
// (or you could create variations if you had them)
export const FRAMES = {
  [GiaiDoan.TRUNG]: { IDLE: STAGE_1_EGG, HAPPY: STAGE_1_EGG },
  [GiaiDoan.NUT_VO]: { IDLE: STAGE_2_CRACKED, HAPPY: STAGE_2_CRACKED },
  [GiaiDoan.SO_SINH]: { IDLE: STAGE_3_BABY, HAPPY: STAGE_3_BABY },
  [GiaiDoan.THIEU_NIEN]: { IDLE: STAGE_4_TEEN, HAPPY: STAGE_4_TEEN },
  [GiaiDoan.TRUONG_THANH]: { IDLE: STAGE_5_ADULT, HAPPY: STAGE_5_ADULT },
  [GiaiDoan.HON_MA]: { IDLE: GHOST, HAPPY: GHOST },
  POOP: POOP
};