import { useState } from "react";
import {
  Search,
  UserPlus,
  Swords,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { PageContainer } from "@shared/components/layouts";
import { Card, Text, Button, Input } from "@shared/components/ui";

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
    <PageContainer maxWidth="3xl">
      {onBack && (
        <Button
          variant="secondary"
          onClick={onBack}
          className="mb-6 font-semibold"
        >
          ← Quay lại
        </Button>
      )}

      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <Text variant="h2" className="text-main">Bạn bè</Text>
          <Button variant="primary" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Thêm bạn
          </Button>
        </div>

        <div className="mb-6 relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bạn theo tên..."
            className="pl-10"
          />
          <Search className="w-5 h-5 text-primary absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {(["all", "online", "requests"] as const).map((t) => (
            <Button
              key={t}
              variant={tab === t ? "primary" : "secondary"}
              onClick={() => setTab(t)}
              size="sm"
            >
              {t === "all"
                ? `Tất cả (${FRIENDS.length})`
                : t === "online"
                  ? `Online (${FRIENDS.filter((f) => f.online).length})`
                  : `Lời mời (${REQUESTS.length})`}
            </Button>
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
                <Text variant="body" className="font-bold text-main">{f.name}</Text>
                <Text variant="caption" className="text-muted mt-0.5">
                  Elo {f.elo} · {f.online ? "Đang online" : "Offline"}
                </Text>
              </div>
              {tab === "requests" ? (
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-success hover:bg-success/20 p-2 border border-success/30">
                    <Check className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" className="text-danger hover:bg-danger/20 p-2 border border-danger/30">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={!f.online}
                    title="Mời chơi"
                    className="p-2 text-primary"
                  >
                    <Swords className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    title="Nhắn tin"
                    className="p-2 text-primary"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
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
      </Card>
    </PageContainer>
  );
}
