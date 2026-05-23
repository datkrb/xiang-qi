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
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-blue-50 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-blue-50 rounded-lg font-semibold"
          >
            ← Quay lại
          </button>
        )}

        <div className="bg-linear-to-r from-blue-800 to-blue-700 rounded-2xl p-6 shadow-xl border-4 border-blue-900 text-blue-50">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div
              className="w-28 h-28 rounded-full bg-blue-50 text-blue-700 border-4 border-blue-900 flex items-center justify-center shadow-lg"
              style={{ fontFamily: "serif", fontSize: 56, fontWeight: 700 }}
            >
              帥
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">Cao Thủ 2026</h1>
              <p className="text-blue-200/80">
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
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg font-semibold flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Sửa
              </button>
              <button className="px-4 py-2 bg-blue-900 hover:bg-blue-800 rounded-lg font-semibold flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Tổng ván" value="247" />
          <Stat label="Thắng" value="142" color="text-green-700" />
          <Stat label="Thua" value="89" color="text-red-700" />
          <Stat label="Hoà" value="16" color="text-blue-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Swords className="w-5 h-5" /> Ván gần đây
            </h3>
            <ul className="space-y-2">
              {RECENT_GAMES.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-blue-900">
                      vs {g.opponent}
                    </div>
                    <div className="text-xs text-blue-700">
                      {g.mode} · {g.date}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      g.result === "win"
                        ? "bg-green-600 text-white"
                        : g.result === "loss"
                          ? "bg-red-600 text-white"
                          : "bg-blue-500 text-white"
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

          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5" /> Thành tựu
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((a) => (
                <li
                  key={a.name}
                  className={`p-3 rounded-lg border-2 ${a.unlocked ? "bg-blue-50 border-blue-400" : "bg-gray-100 border-gray-300 opacity-60"}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-10 h-10 rounded-full bg-blue-700 text-blue-50 flex items-center justify-center"
                      style={{
                        fontFamily: "serif",
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {a.icon}
                    </span>
                    <div>
                      <div className="font-bold text-blue-900 text-sm">
                        {a.name}
                      </div>
                      <div className="text-xs text-blue-700">{a.desc}</div>
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
    <span className="flex items-center gap-1 px-3 py-1 bg-blue-900/40 rounded-full text-sm">
      {icon} {label}
    </span>
  );
}

function Stat({
  label,
  value,
  color = "text-blue-900",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow border border-blue-200 text-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-blue-700 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
