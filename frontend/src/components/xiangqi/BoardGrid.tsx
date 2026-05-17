import { BOARD_H, BOARD_W, CELL, COLS, ROWS, px, py } from './constants';

const STROKE = '#5a3a1a';

function PalaceDiagonals() {
  const line = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line key={key} x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} stroke={STROKE} strokeWidth={1.5} />
  );
  return (
    <>
      {line(3, 0, 5, 2, 'rp1')}
      {line(5, 0, 3, 2, 'rp2')}
      {line(3, 7, 5, 9, 'bp1')}
      {line(5, 7, 3, 9, 'bp2')}
    </>
  );
}

function PositionMarker({ x, y }: { x: number; y: number }) {
  const cx = px(x);
  const cy = py(y);
  const off = 6;
  const len = 5;
  const brackets = [
    { sx: -1, sy: -1 },
    { sx: 1, sy: -1 },
    { sx: -1, sy: 1 },
    { sx: 1, sy: 1 },
  ];
  return (
    <g stroke={STROKE} strokeWidth={1.2} fill="none">
      {brackets.map((b, i) => {
        if ((x === 0 && b.sx === -1) || (x === COLS - 1 && b.sx === 1)) return null;
        return (
          <g key={i}>
            <line
              x1={cx + b.sx * off}
              y1={cy + b.sy * off}
              x2={cx + b.sx * (off + len)}
              y2={cy + b.sy * off}
            />
            <line
              x1={cx + b.sx * off}
              y1={cy + b.sy * off}
              x2={cx + b.sx * off}
              y2={cy + b.sy * (off + len)}
            />
          </g>
        );
      })}
    </g>
  );
}

const MARKER_POSITIONS: [number, number][] = [
  [1, 2], [7, 2], [1, 7], [7, 7],
  [0, 3], [2, 3], [4, 3], [6, 3], [8, 3],
  [0, 6], [2, 6], [4, 6], [6, 6], [8, 6],
];

export function BoardGrid() {
  const horizontals = Array.from({ length: ROWS }).map((_, r) => (
    <line
      key={`h${r}`}
      x1={px(0)}
      y1={py(r)}
      x2={px(COLS - 1)}
      y2={py(r)}
      stroke={STROKE}
      strokeWidth={1.5}
    />
  ));

  const verticals: JSX.Element[] = [];
  for (let c = 0; c < COLS; c++) {
    if (c === 0 || c === COLS - 1) {
      verticals.push(
        <line
          key={`v${c}`}
          x1={px(c)}
          y1={py(0)}
          x2={px(c)}
          y2={py(ROWS - 1)}
          stroke={STROKE}
          strokeWidth={1.5}
        />
      );
    } else {
      verticals.push(
        <line key={`v${c}b`} x1={px(c)} y1={py(0)} x2={px(c)} y2={py(4)} stroke={STROKE} strokeWidth={1.5} />,
        <line key={`v${c}t`} x1={px(c)} y1={py(5)} x2={px(c)} y2={py(9)} stroke={STROKE} strokeWidth={1.5} />
      );
    }
  }

  return (
    <svg width={BOARD_W} height={BOARD_H} className="absolute inset-0 pointer-events-none">
      {horizontals}
      {verticals}
      <PalaceDiagonals />
      {MARKER_POSITIONS.map(([x, y]) => (
        <PositionMarker key={`mk-${x}-${y}`} x={x} y={y} />
      ))}
      <text
        x={px(1.5)}
        y={py(4) + CELL / 2 + 6}
        textAnchor="middle"
        fontSize={22}
        fill={STROKE}
        opacity={0.7}
        fontFamily="serif"
      >
        楚 河
      </text>
      <text
        x={px(6.5)}
        y={py(4) + CELL / 2 + 6}
        textAnchor="middle"
        fontSize={22}
        fill={STROKE}
        opacity={0.7}
        fontFamily="serif"
      >
        漢 界
      </text>
    </svg>
  );
}
