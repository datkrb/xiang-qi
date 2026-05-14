import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

interface GameControlsProps {
  onUndo: () => void;
  onReset: () => void;
  onAIToggle: () => void;
  aiEnabled: boolean;
  skill: number;
  onSkillChange: (skill: number) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onReset,
  onAIToggle,
  aiEnabled,
  skill,
  onSkillChange,
}) => {
  return (
    <Stack
      spacing={2}
      sx={{ padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}
    >
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={onUndo}
          size="small"
        >
          Undo
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onReset}
          size="small"
        >
          Reset
        </Button>
      </Stack>

      <Box>
        <Typography variant="body2" gutterBottom>
          AI Opponent
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant={aiEnabled ? "contained" : "outlined"}
            onClick={onAIToggle}
            size="small"
          >
            {aiEnabled ? "ON" : "OFF"}
          </Button>
          <Typography variant="caption">Skill: {skill}/6</Typography>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1}>
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <Button
            key={s}
            variant={skill === s ? "contained" : "outlined"}
            onClick={() => onSkillChange(s)}
            size="small"
            sx={{ minWidth: "28px", padding: "4px" }}
          >
            {s}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default GameControls;
