import {
  Volume2,
  VolumeX,
  Globe,
  Palette,
  Bell,
  Shield,
  LogOut,
} from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Toggle } from "./ui";
import { useSettings } from "../hooks/useSettings";

interface SettingsScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export default function SettingsScreen({
  onBack,
  onLogout,
}: SettingsScreenProps) {
  const { settings, updateSettings } = useSettings();

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
          <SettingsToggle
            label="Hiệu ứng âm thanh"
            checked={settings.audio.soundEnabled}
            onChange={(value) =>
              updateSettings({
                audio: { ...settings.audio, soundEnabled: value },
              })
            }
          />
          {settings.audio.soundEnabled && (
            <Slider
              label="Âm lượng SFX"
              value={settings.audio.sfxVolume}
              onChange={(value) =>
                updateSettings({
                  audio: { ...settings.audio, sfxVolume: value },
                })
              }
            />
          )}
          <SettingsToggle
            label="Nhạc nền"
            checked={settings.audio.musicEnabled}
            onChange={(value) =>
              updateSettings({
                audio: { ...settings.audio, musicEnabled: value },
              })
            }
          />
          {settings.audio.musicEnabled && (
            <Slider
              label="Âm lượng nhạc"
              value={settings.audio.musicVolume}
              onChange={(value) =>
                updateSettings({
                  audio: { ...settings.audio, musicVolume: value },
                })
              }
            />
          )}
        </Section>

        <Section title="Hiển thị" icon={<Palette className="w-5 h-5" />}>
          {/* Task 5.2: Add "Theme" section with ThemeSwitcher */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-main mb-2">
                Chủ đề ứng dụng
              </h4>
              <p className="text-xs text-muted mb-3">
                Chọn giao diện ưa thích của bạn
              </p>
              <ThemeSwitcher />
            </div>
            <div className="border-t border-border pt-4">
              <SettingsToggle
                label="Hiện toạ độ bàn cờ"
                checked={settings.display.showCoordinates}
                onChange={(value) =>
                  updateSettings({
                    display: { ...settings.display, showCoordinates: value },
                  })
                }
              />
              <SettingsToggle
                label="Tô sáng nước đi hợp lệ"
                checked={settings.display.highlightMoves}
                onChange={(value) =>
                  updateSettings({
                    display: { ...settings.display, highlightMoves: value },
                  })
                }
              />
            </div>
          </div>
        </Section>

        <Section title="Ngôn ngữ" icon={<Globe className="w-5 h-5" />}>
          <Select
            label="Ngôn ngữ"
            value={settings.language.language}
            onChange={(v) => updateSettings({ language: { language: v } })}
            options={[
              { value: "vi", label: "Tiếng Việt" },
              { value: "en", label: "English" },
              { value: "zh", label: "中文" },
            ]}
          />
        </Section>

        <Section title="Thông báo" icon={<Bell className="w-5 h-5" />}>
          <SettingsToggle
            label="Bật thông báo"
            checked={settings.notifications.notificationsEnabled}
            onChange={(value) =>
              updateSettings({
                notifications: {
                  ...settings.notifications,
                  notificationsEnabled: value,
                },
              })
            }
          />
          <SettingsToggle
            label="Thông báo lời mời chơi"
            checked={settings.notifications.gameInvitations}
            onChange={(value) =>
              updateSettings({
                notifications: {
                  ...settings.notifications,
                  gameInvitations: value,
                },
              })
            }
          />
          <SettingsToggle
            label="Thông báo tin nhắn"
            checked={settings.notifications.messages}
            onChange={(value) =>
              updateSettings({
                notifications: { ...settings.notifications, messages: value },
              })
            }
          />
        </Section>

        <Section
          title="Tài khoản"
          icon={<Shield className="w-5 h-5 text-primary" />}
        >
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

      {!settings.audio.soundEnabled && (
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

function SettingsToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-surface-opaque rounded-xl border border-transparent hover:border-border transition-colors overflow-hidden">
      <span className="text-main font-semibold shrink">{label}</span>
      <div className="shrink-0">
        <Toggle
          isChecked={checked}
          onChange={onChange}
          size="sm"
          aria-label={label}
        />
      </div>
    </div>
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
