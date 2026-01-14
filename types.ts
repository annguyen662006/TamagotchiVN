


export enum GiaiDoan {
  TRUNG = 'TRUNG',        // Stage 1
  NUT_VO = 'NUT_VO',      // Stage 2
  SO_SINH = 'SO_SINH',    // Stage 3
  THIEU_NIEN = 'THIEU_NIEN', // Stage 4
  TRUONG_THANH = 'TRUONG_THANH', // Stage 5
  HON_MA = 'HON_MA'
}

export type LoaiThu = 'GA' | 'PHUONG_HOANG' | 'RONG_BANG' | 'THAN_RUNG';

export interface ChiSo {
  doi: number; // Hunger (0-100, 0 is full, 100 is starving)
  vui: number; // Happiness (0-100)
  veSinh: number; // Hygiene (0-100)
  nangLuong: number; // Energy (0-100)
}

export interface TrangThaiGame {
  loaiThu: LoaiThu | null; // Null means selection needed
  giaiDoan: GiaiDoan;
  tuoi: number; // In seconds/ticks roughly
  chiSo: ChiSo;
  dangNgu: boolean;
  biOm: boolean;
  phan: number; // Poop count
  hoatDongHienTai: 'DUNG_YEN' | 'AN' | 'CHOI' | 'NGU' | 'TAM' | 'NOI_CHUYEN' | 'CHET' | 'TU_CHOI';
}

export interface TinNhan {
  nguoiGui: 'USER' | 'PET';
  noiDung: string;
}