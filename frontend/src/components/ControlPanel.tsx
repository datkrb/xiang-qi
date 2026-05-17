import { useGame } from "../context/GameContext";

export function ControlPanel() {
  const { handleReset, handleUndo } = useGame();

  const controls = [
    { label: "↶ Undo", onClick: handleUndo, color: "blue" },
    { label: "↷ Redo", onClick: () => console.log("Redo"), color: "blue" },
    { label: "💡 Hint", onClick: () => console.log("Hint"), color: "yellow" },
    {
      label: "💾 Save Game",
      onClick: () => console.log("Save"),
      color: "green",
    },
    {
      label: "📂 Load Game",
      onClick: () => console.log("Load"),
      color: "purple",
    },
    { label: "🔄 Restart", onClick: handleReset, color: "orange" },
    {
      label: "🤝 Offer Draw",
      onClick: () => console.log("Draw"),
      color: "teal",
    },
    { label: "🏳️ Resign", onClick: () => console.log("Resign"), color: "red" },
    {
      label: "⏸ Pause Menu",
      onClick: () => console.log("Pause"),
      color: "gray",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500 hover:bg-blue-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    teal: "bg-teal-500 hover:bg-teal-600",
    red: "bg-red-500 hover:bg-red-600",
    gray: "bg-gray-700 hover:bg-gray-800",
  };

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-800 mb-3">Game Controls</h3>

      {controls.map(({ label, onClick, color }) => (
        <button
          key={label}
          onClick={onClick}
          className={`
            w-full text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md
            flex items-center justify-center gap-2
            ${colorMap[color]}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
