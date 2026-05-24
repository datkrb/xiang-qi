import { useState } from "react";
import {
  Volume2,
  VolumeX,
  Globe,
  Palette,
  Bell,
  Shield,
  LogOut,
} from "lucide-react";

interface SettingsScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export default function SettingsScreen({
  onBack,
  onLogout,
}: SettingsScreenProps) {
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const [musicVol, setMusicVol] = useState(60);
  const [sfxVol, setSfxVol] = useState(80);
  const [notif, setNotif] = useState(true);
  const [theme, setTheme] = useState<"classic" | "dark" | "wood">("classic");
  const [lang, setLang] = useState<"vi" | "en" | "zh">("vi");
  const [showCoords, setShowCoords] = useState(true);
  const [highlightMoves, setHighlightMoves] = useState(true);

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

        <h1 className="text-3xl font-bold font-heading text-main">Cài đặt</h1>

        <Section title="Âm thanh" icon={<Volume2 className="w-5 h-5" />}>
          <Toggle label="Hiệu ứng âm thanh" value={sound} onChange={setSound} />
          {sound && (
            <Slider label="Âm lượng SFX" value={sfxVol} onChange={setSfxVol} />
          )}
          <Toggle label="Nhạc nền" value={music} onChange={setMusic} />
          {music && (
            <Slider
              label="Âm lượng nhạc"
              value={musicVol}
              onChange={setMusicVol}
            />
          )}
        </Section>

        <Section title="Hiển thị" icon={<Palette className="w-5 h-5" />}>
          <Select
            label="Giao diện bàn cờ"
            value={theme}
            onChange={(v) => setTheme(v as typeof theme)}
            options={[
              { value: "classic", label: "Cổ điển (xanh/lam)" },
              { value: "dark", label: "Tối" },
              { value: "wood", label: "Gỗ" },
            ]}
          />
          <Toggle
            label="Hiện toạ độ bàn cờ"
            value={showCoords}
            onChange={setShowCoords}
          />
          <Toggle
            label="Tô sáng nước đi hợp lệ"
            value={highlightMoves}
            onChange={setHighlightMoves}
          />
        </Section>

        <Section title="Ngôn ngữ" icon={<Globe className="w-5 h-5" />}>
          <Select
            label="Ngôn ngữ"
            value={lang}
            onChange={(v) => setLang(v as typeof lang)}
            options={[
              { value: "vi", label: "Tiếng Việt" },
              { value: "en", label: "English" },
              { value: "zh", label: "中文" },
            ]}
          />
        </Section>

        <Section title="Thông báo" icon={<Bell className="w-5 h-5" />}>
          <Toggle label="Bật thông báo" value={notif} onChange={setNotif} />
          <Toggle
            label="Thông báo lời mời chơi"
            value={notif}
            onChange={setNotif}
          />
          <Toggle
            label="Thông báo tin nhắn"
            value={notif}
            onChange={setNotif}
          />
        </Section>

        <Section title="Tài khoản" icon={<Shield className="w-5 h-5 text-primary" />}>
          <button className="w-full text-left px-4 py-3 bg-surface-opaque hover:bg-surface-hover transition-colors rounded-xl font-semibold text-main border border-transparent hover:border-border">
            Đổi mật khẩu
          </button>
          <button className="w-full text-left px-4 py-3 bg-surface-opaque hover:bg-surface-hover transition-colors rounded-xl font-semibold text-main border border-transparent hover:border-border">
            Quản lý dữ liệu
          </button>
          <button
            onClick={onLogout}
            className="w-full btn-danger flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </Section>

        <p className="text-center text-xs text-muted">Cờ Tướng v1.0.0</p>
      </div>

      {!sound && (
        <div className="fixed bottom-4 left-4 glass-panel text-muted px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-lg">
          <VolumeX className="w-4 h-4 text-danger" /> Đã tắt âm thanh
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-lg font-bold font-heading text-main mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between p-4 bg-surface-opaque rounded-xl cursor-pointer border border-transparent hover:border-border transition-colors">
      <span className="text-main font-semibold">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-primary" : "bg-surface-hover"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-6" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="px-4 py-3 bg-surface-opaque rounded-xl border border-transparent hover:border-border transition-colors">
      <div className="flex justify-between text-sm text-main mb-2">
        <span className="font-semibold">{label}</span>
        <span className="font-bold text-primary">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="flex items-center justify-between p-4 bg-surface-opaque rounded-xl border border-transparent hover:border-border transition-colors">
      <span className="text-main font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="px-3 py-1 bg-surface outline-none border border-border rounded-lg text-main font-semibold focus:border-primary transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
