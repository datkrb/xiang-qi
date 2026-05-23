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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-blue-800 to-cyan-800 p-4">
      <div className="w-full max-w-md bg-blue-50/95 backdrop-blur rounded-2xl shadow-2xl border-4 border-blue-900 p-8">
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full bg-blue-700 text-blue-50 flex items-center justify-center border-4 border-blue-900 mb-3"
            style={{ fontFamily: "serif", fontSize: 32, fontWeight: 700 }}
          >
            帥
          </div>
          <h1 className="text-2xl font-bold text-blue-900">Đăng Nhập</h1>
          <p className="text-sm text-blue-800/70">Chào mừng trở lại bàn cờ!</p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-blue-900">Email</span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-blue-300 focus-within:border-blue-700">
              <Mail className="w-4 h-4 text-blue-700" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 outline-none bg-transparent text-blue-900"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-blue-900">
              Mật khẩu
            </span>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-blue-300 focus-within:border-blue-700">
              <Lock className="w-4 h-4 text-blue-700" />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 outline-none bg-transparent text-blue-900"
              />
              <button
                onClick={() => setShowPwd((v) => !v)}
                className="text-blue-700"
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
            <label className="flex items-center gap-2 text-blue-900">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Ghi nhớ tôi
            </label>
            <button
              onClick={() => onNavigate?.("forgot")}
              className="text-blue-700 hover:underline font-semibold"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            onClick={() => onLogin?.({ email, password })}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-800 text-blue-50 rounded-lg font-bold shadow-lg"
          >
            <LogIn className="w-5 h-5" /> Đăng nhập
          </button>

          <button
            onClick={() => onGuestPlay?.()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg"
          >
            Chơi với tư cách khách
          </button>

          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-blue-300" />
            <span className="text-xs text-blue-700">HOẶC</span>
            <div className="flex-1 h-px bg-blue-300" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-2 bg-white border-2 border-blue-300 hover:border-blue-700 rounded-lg font-semibold text-blue-900">
              Google
            </button>
            <button className="py-2 bg-white border-2 border-blue-300 hover:border-blue-700 rounded-lg font-semibold text-blue-900">
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-blue-800">
            Chưa có tài khoản?{" "}
            <button
              onClick={() => onNavigate?.("register")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full text-center text-sm text-blue-700 hover:underline"
            >
              ← Quay lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
