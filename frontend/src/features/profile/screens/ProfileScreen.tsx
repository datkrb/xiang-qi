import { Trophy, Swords, Star, TrendingUp, Edit3, Share2 } from "lucide-react";

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
    <div className="w-full p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-surface-opaque hover:bg-surface-hover transition-colors text-muted hover:text-main rounded-xl font-semibold border border-border"
          >
            ← Quay lại
          </button>
        )}

        <div className="glass-panel border-primary shadow-[0_0_15px_rgba(14,165,233,0.2)] rounded-2xl p-6 text-main">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div
              className="w-28 h-28 rounded-full bg-primary/20 text-primary border-2 border-primary flex items-center justify-center shadow-lg"
              style={{ fontFamily: "Outfit", fontSize: 56, fontWeight: 700 }}
            >
              帥
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold font-heading">Cao Thủ 2026</h1>
              <p className="text-muted mt-1">
                Tham gia từ tháng 3, 2025 · Việt Nam
              </p>
              <div className="mt-3 flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge
                  icon={<Trophy className="w-4 h-4" />}
                  label="Xếp hạng #128"
                />
                <Badge icon={<Star className="w-4 h-4" />} label="Elo 1820" />
                <Badge
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="Tăng 45 tuần này"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="px-5 py-2 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl font-semibold flex items-center gap-2 transition-colors">
                <Edit3 className="w-4 h-4" /> Sửa
              </button>
              <button className="px-5 py-2 btn-primary rounded-xl font-semibold flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Tổng ván" value="247" color="text-main" />
          <Stat label="Thắng" value="142" color="text-success" />
          <Stat label="Thua" value="89" color="text-danger" />
          <Stat label="Hoà" value="16" color="text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xl font-bold font-heading text-main mb-4 flex items-center gap-2">
              <Swords className="w-5 h-5 text-primary" /> Ván gần đây
            </h3>
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
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xl font-bold font-heading text-main mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" /> Thành tựu
            </h3>
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
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-opaque border border-border rounded-full text-sm font-medium">
      {icon} {label}
    </span>
  );
}

function Stat({
  label,
  value,
  color = "text-main",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 text-center">
      <div className={`text-3xl font-bold font-heading ${color}`}>{value}</div>
      <div className="text-xs text-muted mt-1 uppercase tracking-wider font-semibold">
        {label}
      </div>
    </div>
  );
}
