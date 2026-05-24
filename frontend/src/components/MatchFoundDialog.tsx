import { Copy, ExternalLink } from "lucide-react";

interface Props {
  roomId: string;
  matchUrl?: string;
  onClose?: () => void;
}

export default function MatchFoundDialog({ roomId, matchUrl, onClose }: Props) {
  const fullUrl = matchUrl
    ? `${window.location.origin}${matchUrl}`
    : `${window.location.origin}/match/${roomId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert("Match link copied to clipboard");
    } catch (err) {
      console.warn("Clipboard write failed", err);
    }
  };

  const handleOpen = () => {
    window.open(fullUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="glass-panel rounded-2xl p-6 z-[60] w-full max-w-md shadow-2xl border-border transform transition-all">
        <h3 className="text-2xl font-bold font-heading mb-2 text-main">Match Found</h3>
        <p className="text-sm text-muted mb-6">
          Your opponent has been found. Share or open the match link:
        </p>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="flex-1 px-4 py-2 border border-border rounded-xl bg-surface-opaque text-main outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 btn-primary rounded-xl"
            title="Copy link"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={handleOpen}
            className="px-4 py-2 bg-success hover:bg-success/80 text-success-foreground rounded-xl transition-colors shadow-lg shadow-success/20"
            title="Open match"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-xl border-border bg-surface-opaque hover:bg-surface-hover text-main transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
