import {
  Volume2,
  VolumeX,
  Globe,
  Palette,
  Bell,
  Shield,
  LogOut,
} from "lucide-react";
import { ThemeSwitcher, Section, SettingsToggle } from "@features/settings/components";
import { Text, Button, Select, Slider } from "@shared/components/ui";
import { PageContainer } from "@shared/components/layouts";
import { useSettings } from "@shared/hooks/useSettings";

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

      <Text variant="h2" className="text-main mb-6">Cài đặt</Text>

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
            onChange={(v) => updateSettings({ language: { language: v as any } })}
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
          <Button variant="secondary" className="w-full justify-start font-semibold">
            Đổi mật khẩu
          </Button>
          <Button variant="secondary" className="w-full justify-start font-semibold">
            Quản lý dữ liệu
          </Button>
          <Button
            variant="secondary"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 font-bold text-danger border-danger hover:bg-danger/10"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </Button>
        </Section>

        <Text variant="caption" className="text-center text-muted w-full block">Cờ Tướng v1.0.0</Text>

      {!settings.audio.soundEnabled && (
        <div className="fixed bottom-4 left-4 glass-panel text-muted px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-lg">
          <VolumeX className="w-4 h-4 text-danger" /> Đã tắt âm thanh
        </div>
      )}
    </PageContainer>
  );
}


