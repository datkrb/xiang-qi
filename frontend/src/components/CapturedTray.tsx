import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { Piece, Color } from "../types";
import { CHINESE_CHARS } from "./constants";

interface CapturedTrayProps {
  pieces: Piece[];
  color: Color;
}

const CapturedTray: React.FC<CapturedTrayProps> = ({ pieces, color }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemSize, setItemSize] = useState(24);
  const GAP = 6;
  const MIN = 14;
  const MAX = 30;

  const recalc = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const n = Math.max(1, pieces.length);
    const w = el.clientWidth || 0;
    if (pieces.length === 0) {
      setItemSize(24);
      return;
    }
    const s = Math.floor((w - (n - 1) * GAP) / n);
    setItemSize(Math.min(MAX, Math.max(MIN, s)));
  }, [pieces.length]);

  useEffect(() => {
    recalc();
  }, [recalc]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => recalc());
    ro.observe(el);
    return () => ro.disconnect();
  }, [recalc]);

  const fontSize = Math.round(itemSize * 0.58);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        gap: `${GAP}px`,
        alignItems: "center",
        flexWrap: "nowrap",
        overflow: "hidden",
        minHeight: itemSize + 8,
      }}
    >
      {pieces.map((p, i) => (
        <Box
          key={`${color}-cap-${i}`}
          className={`piece ${color}`}
          sx={{ width: itemSize, height: itemSize, fontSize }}
          title={p.t}
        >
          {color === "black"
            ? CHINESE_CHARS[p.t.toUpperCase() as keyof typeof CHINESE_CHARS]
            : CHINESE_CHARS[p.t.toLowerCase() as keyof typeof CHINESE_CHARS]}
        </Box>
      ))}
    </Box>
  );
};

export default CapturedTray;
