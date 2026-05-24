import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

interface LoginScreenProps {
  onBack?: () => void;
  onLogin?: (payload: { email: string; password: string } | string) => void;
  onGuestPlay?: () => void;
  onNavigate?: (screen: "register" | "forgot") => void;
}

export default function LoginScreen({
  onBack,
  onLogin,
  onGuestPlay,
  onNavigate,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 animate-fade-in">
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center border-2 border-primary mb-3"
            style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 700 }}
          >
            帥
          </div>
          <h1 className="text-2xl font-bold font-heading text-main">Đăng Nhập</h1>
          <p className="text-sm text-muted">Chào mừng trở lại bàn cờ!</p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-main">Email</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-surface-opaque rounded-lg border border-border focus-within:border-primary transition-colors">
              <Mail className="w-4 h-4 text-primary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 outline-none bg-transparent text-main placeholder:text-muted"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-main">Mật khẩu</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-surface-opaque rounded-lg border border-border focus-within:border-primary transition-colors">
              <Lock className="w-4 h-4 text-primary" />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 outline-none bg-transparent text-main placeholder:text-muted"
              />
              <button
                onClick={() => setShowPwd((v) => !v)}
                className="text-primary hover:text-primary-hover"
              >
                {showPwd ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-main cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-primary"
              />
              Ghi nhớ tôi
            </label>
            <button
              onClick={() => onNavigate?.("forgot")}
              className="text-primary hover:text-primary-hover font-semibold transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            onClick={() => onLogin?.({ email, password })}
            className="w-full btn-primary py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" /> Đăng nhập
          </button>

          <button
            onClick={() => onGuestPlay?.()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-lg font-bold transition-all"
          >
            Chơi với tư cách khách
          </button>

          <div className="flex items-center gap-2 my-2 opacity-50">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">HOẶC</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-2 bg-surface-opaque border border-border hover:border-primary rounded-lg font-semibold text-main transition-colors">
              Google
            </button>
            <button className="py-2 bg-surface-opaque border border-border hover:border-primary rounded-lg font-semibold text-main transition-colors">
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-muted">
            Chưa có tài khoản?{" "}
            <button
              onClick={() => onNavigate?.("register")}
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              Đăng ký ngay
            </button>
          </p>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full text-center text-sm text-muted hover:text-main transition-colors mt-2"
            >
              ← Quay lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
