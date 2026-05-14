import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Move } from "../types";

interface MoveLogProps {
  moves: Move[];
}

const MoveLog: React.FC<MoveLogProps> = ({ moves }) => {
  return (
    <Box
      sx={{ padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Move History
      </Typography>
      <Stack spacing={1} sx={{ maxHeight: "300px", overflowY: "auto" }}>
        {[...moves].reverse().map((move, i) => (
          <Typography key={i} variant="caption">
            {`${String.fromCharCode(65 + move.from[1])}${10 - move.from[0]} → ${String.fromCharCode(
              65 + move.to[1],
            )}${10 - move.to[0]}`}
            {move.captured && ` (captured ${move.captured.t})`}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
};

export default MoveLog;
