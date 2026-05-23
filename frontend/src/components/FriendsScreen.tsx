import { useState } from "react";
import {
  Search,
  UserPlus,
  Swords,
  MessageSquare,
  Check,
  X,
} from "lucide-react";

interface FriendsScreenProps {
  onBack?: () => void;
}

interface Friend {
  id: number;
  name: string;
  online: boolean;
  elo: number;
  avatar: string;
}

const FRIENDS: Friend[] = [
  { id: 1, name: "Long Vương", online: true, elo: 1920, avatar: "車" },
  { id: 2, name: "Phượng Hoàng", online: true, elo: 1840, avatar: "馬" },
  { id: 3, name: "Sư Phụ Trần", online: false, elo: 2100, avatar: "炮" },
  { id: 4, name: "Tiểu Yến Tử", online: true, elo: 1650, avatar: "兵" },
  { id: 5, name: "Cao Thủ Ẩn Danh", online: false, elo: 2250, avatar: "帥" },
];

const REQUESTS: Friend[] = [
  { id: 10, name: "Tân Binh", online: true, elo: 1200, avatar: "卒" },
  { id: 11, name: "Thiên Tài", online: false, elo: 1980, avatar: "相" },
];

export default function FriendsScreen({ onBack }: FriendsScreenProps) {
  const [tab, setTab] = useState<"all" | "online" | "requests">("all");
  const [query, setQuery] = useState("");

  const list =
    tab === "requests"
      ? REQUESTS
      : FRIENDS.filter(
          (f) =>
            (tab === "online" ? f.online : true) &&
            f.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-blue-50 to-cyan-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-blue-50 rounded-lg font-semibold"
          >
            ← Quay lại
          </button>
        )}

        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-blue-900">Bạn bè</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-blue-50 rounded-lg font-semibold">
              <UserPlus className="w-4 h-4" /> Thêm bạn
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border-2 border-blue-300 focus-within:border-blue-700 mb-4">
            <Search className="w-4 h-4 text-blue-700" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm bạn theo tên..."
              className="flex-1 outline-none bg-transparent text-blue-900"
            />
          </div>

          <div className="flex gap-2 mb-4">
            {(["all", "online", "requests"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  tab === t
                    ? "bg-blue-700 text-blue-50"
                    : "bg-blue-100 text-blue-900 hover:bg-blue-200"
                }`}
              >
                {t === "all"
                  ? `Tất cả (${FRIENDS.length})`
                  : t === "online"
                    ? `Online (${FRIENDS.filter((f) => f.online).length})`
                    : `Lời mời (${REQUESTS.length})`}
              </button>
            ))}
          </div>

          <ul className="space-y-2">
            {list.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <div className="relative">
                  <span
                    className="w-12 h-12 rounded-full bg-blue-700 text-blue-50 flex items-center justify-center border-2 border-blue-900"
                    style={{
                      fontFamily: "serif",
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    {f.avatar}
                  </span>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-blue-50 ${f.online ? "bg-green-500" : "bg-gray-400"}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-blue-900">{f.name}</div>
                  <div className="text-xs text-blue-700">
                    Elo {f.elo} · {f.online ? "Đang online" : "Offline"}
                  </div>
                </div>
                {tab === "requests" ? (
                  <div className="flex gap-2">
                    <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      disabled={!f.online}
                      className="p-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-blue-50 rounded-lg"
                      title="Mời chơi"
                    >
                      <Swords className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-blue-700 hover:bg-blue-800 text-blue-50 rounded-lg"
                      title="Nhắn tin"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
            {list.length === 0 && (
              <li className="text-center text-blue-700 py-8">
                Không có kết quả
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
