import { PieceType } from './types';

export const COLS = 9;
export const ROWS = 10;
export const CELL = 60;
export const PAD = 36;
export const PIECE = 52;

export const BOARD_W = (COLS - 1) * CELL + PAD * 2;
export const BOARD_H = (ROWS - 1) * CELL + PAD * 2;

/** Tọa độ pixel X (không đổi khi lật bàn cờ) */
export const px = (x: number, flipped = false) =>
  flipped ? PAD + (COLS - 1 - x) * CELL : PAD + x * CELL;

/** Tọa độ pixel Y. Khi flipped=true, y=0 ở trên (Đỏ), y=9 ở dưới (Đen) */
export const py = (y: number, flipped = false) =>
  flipped ? PAD + y * CELL : PAD + (ROWS - 1 - y) * CELL;

export const pieceNames: Record<PieceType, { red: string; black: string }> = {
  general: { red: '帥', black: '將' },
  advisor: { red: '仕', black: '士' },
  elephant: { red: '相', black: '象' },
  horse: { red: '馬', black: '馬' },
  chariot: { red: '俥', black: '車' },
  cannon: { red: '炮', black: '砲' },
  soldier: { red: '兵', black: '卒' },
};
