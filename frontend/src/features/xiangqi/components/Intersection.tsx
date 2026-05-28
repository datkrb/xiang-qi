import { CELL, px, py } from '../utils/constants';

interface IntersectionProps {
  x: number;
  y: number;
  showDot?: boolean;
  onClick: (x: number, y: number) => void;
}

export function Intersection({ x, y, showDot, onClick }: IntersectionProps) {
  return (
    <button
      onClick={() => onClick(x, y)}
      className="absolute rounded-full flex items-center justify-center"
      style={{
        left: px(x) - CELL / 2,
        top: py(y) - CELL / 2,
        width: CELL,
        height: CELL,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {showDot && (
        <span
          className="block rounded-full bg-green-600/60"
          style={{ width: 14, height: 14 }}
        />
      )}
    </button>
  );
}
