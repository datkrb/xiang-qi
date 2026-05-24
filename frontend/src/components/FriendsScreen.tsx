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
    <div className="w-full p-4 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-surface-opaque hover:bg-surface-hover transition-colors text-muted hover:text-main rounded-xl font-semibold border border-border"
          >
            ← Quay lại
          </button>
        )}

        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold font-heading text-main">Bạn bè</h1>
            <button className="flex items-center gap-2 btn-primary px-4 py-2 rounded-xl">
              <UserPlus className="w-4 h-4" /> Thêm bạn
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-surface-opaque rounded-xl border border-border focus-within:border-primary transition-colors mb-6">
            <Search className="w-5 h-5 text-primary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm bạn theo tên..."
              className="flex-1 outline-none bg-transparent text-main placeholder:text-muted"
            />
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {(["all", "online", "requests"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors border ${
                  tab === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface-opaque text-muted hover:text-main border-transparent hover:border-border"
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

          <ul className="space-y-3">
            {list.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-4 p-4 bg-surface-opaque rounded-xl border border-transparent hover:border-primary transition-colors"
              >
                <div className="relative">
                  <span
                    className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30"
                    style={{
                      fontFamily: "Outfit",
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    {f.avatar}
                  </span>
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface ${f.online ? "bg-success" : "bg-muted"}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-main text-lg">{f.name}</div>
                  <div className="text-sm text-muted">
                    Elo {f.elo} · {f.online ? "Đang online" : "Offline"}
                  </div>
                </div>
                {tab === "requests" ? (
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-success/20 hover:bg-success/30 text-success rounded-xl transition-colors border border-success/30">
                      <Check className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 bg-danger/20 hover:bg-danger/30 text-danger rounded-xl transition-colors border border-danger/30">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      disabled={!f.online}
                      className="p-2.5 bg-surface hover:bg-surface-hover disabled:opacity-50 disabled:hover:bg-surface border border-border text-primary rounded-xl transition-colors"
                      title="Mời chơi"
                    >
                      <Swords className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2.5 bg-surface hover:bg-surface-hover border border-border text-primary rounded-xl transition-colors"
                      title="Nhắn tin"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </li>
            ))}
            {list.length === 0 && (
              <li className="text-center text-muted py-10">
                Không có kết quả
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
