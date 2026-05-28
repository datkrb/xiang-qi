import { Trophy, Swords, Star, TrendingUp, Edit3, Share2 } from "lucide-react";
import { PageContainer } from "@shared/components/layouts";
import { Card, Badge, Button, Text } from "@shared/components/ui";
import { StatCard } from "@shared/components/common/StatCard";
interface ProfileScreenProps {
  onBack?: () => void;
}

const RECENT_GAMES = [
  {
    id: 1,
    opponent: "Long Vương",
    result: "win",
    mode: "PvP",
    date: "2026-05-20",
  },
  {
    id: 2,
    opponent: "AI - Hard",
    result: "loss",
    mode: "AI",
    date: "2026-05-19",
  },
  {
    id: 3,
    opponent: "Phượng Hoàng",
    result: "win",
    mode: "PvP",
    date: "2026-05-18",
  },
  {
    id: 4,
    opponent: "AI - Expert",
    result: "draw",
    mode: "AI",
    date: "2026-05-17",
  },
];

const ACHIEVEMENTS = [
  { name: "Tướng Quân", desc: "Thắng 10 ván", icon: "帥", unlocked: true },
  {
    name: "Bậc Thầy Pháo",
    desc: "50 cú ăn quân bằng pháo",
    icon: "炮",
    unlocked: true,
  },
  { name: "Bất Bại", desc: "Chuỗi 5 ván thắng", icon: "車", unlocked: false },
  { name: "Cao Thủ AI", desc: "Thắng AI Expert", icon: "馬", unlocked: false },
];

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  return (
    <PageContainer maxWidth="4xl">
      {onBack && (
        <Button
          variant="secondary"
          onClick={onBack}
          className="mb-6 font-semibold"
        >
          ← Quay lại
        </Button>
      )}

      <Card
        variant="elevated"
        className="p-6 text-main border-primary shadow-[0_0_15px_rgba(14,165,233,0.2)]"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div
            className="w-28 h-28 rounded-full bg-primary/20 text-primary border-2 border-primary flex items-center justify-center shadow-lg"
            style={{ fontFamily: "Outfit", fontSize: 56, fontWeight: 700 }}
          >
            帥
          </div>
          <div className="flex-1 text-center md:text-left">
            <Text variant="h2">Cao Thủ 2026</Text>
            <Text variant="body" className="text-muted mt-1">
              Tham gia từ tháng 3, 2025 · Việt Nam
            </Text>
            <div className="mt-3 flex flex-wrap gap-3 justify-center md:justify-start">
              <Badge variant="default">
                <Trophy className="w-4 h-4" /> Xếp hạng #128
              </Badge>
              <Badge variant="default">
                <Star className="w-4 h-4" /> Elo 1820
              </Badge>
              <Badge variant="default">
                <TrendingUp className="w-4 h-4" /> Tăng 45 tuần này
              </Badge>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="secondary" className="font-semibold flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> Sửa
            </Button>
            <Button variant="primary" className="font-semibold flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Chia sẻ
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard label="Tổng ván" value="247" color="text-main" />
        <StatCard label="Thắng" value="142" color="text-success" />
        <StatCard label="Thua" value="89" color="text-danger" />
        <StatCard label="Hoà" value="16" color="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card variant="elevated" padding="lg">
          <Text variant="h3" className="mb-4 flex items-center gap-2">
            <Swords className="w-5 h-5 text-primary" /> Ván gần đây
          </Text>
          <ul className="space-y-2">
            {RECENT_GAMES.map((g) => (
              <li
                key={g.id}
                className="flex items-center justify-between p-4 bg-surface-opaque border border-border hover:border-primary transition-colors rounded-xl"
              >
                <div>
                  <div className="font-semibold text-main">
                    vs {g.opponent}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {g.mode} · {g.date}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    g.result === "win"
                      ? "bg-success/20 text-success border-success/30"
                      : g.result === "loss"
                        ? "bg-danger/20 text-danger border-danger/30"
                        : "bg-primary/20 text-primary border-primary/30"
                  }`}
                >
                  {g.result === "win"
                    ? "Thắng"
                    : g.result === "loss"
                      ? "Thua"
                      : "Hoà"}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="elevated" padding="lg">
          <Text variant="h3" className="mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" /> Thành tựu
          </Text>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <li
                key={a.name}
                className={`p-3 rounded-xl border transition-colors ${a.unlocked ? "bg-surface-opaque border-primary/50" : "bg-surface-opaque/50 border-border opacity-60"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-12 h-12 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0"
                    style={{
                      fontFamily: "Outfit",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    {a.icon}
                  </span>
                  <div>
                    <div className="font-bold text-main text-sm leading-tight">
                      {a.name}
                    </div>
                    <div className="text-xs text-muted mt-0.5">{a.desc}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}

