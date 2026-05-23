import React from "react";
import { Copy, ExternalLink } from "lucide-react";
import { GuestStorage } from "../utils/GuestStorage";

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 z-60 w-[420px] shadow-xl">
        <h3 className="text-xl font-bold mb-2">Match Found</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your opponent has been found. Share or open the match link:
        </p>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpen}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
