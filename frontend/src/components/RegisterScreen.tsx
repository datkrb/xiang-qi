import { useState } from "react";
import { User, Mail, Lock, UserPlus } from "lucide-react";

interface RegisterScreenProps {
  onBack?: () => void;
  onRegister?: (data: { username: string; email: string; password: string }) => void;
  onNavigate?: (screen: "login") => void;
}

export default function RegisterScreen({
  onBack,
  onRegister,
  onNavigate,
}: RegisterScreenProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const pwdMatch = password.length > 0 && password === confirm;
  const canSubmit = username && email && pwdMatch && agree;

  const strength =
    password.length >= 10
      ? "Mạnh"
      : password.length >= 6
        ? "Trung bình"
        : password.length > 0
          ? "Yếu"
          : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-blue-800 to-cyan-800 p-4">
      <div className="w-full max-w-md bg-blue-50/95 backdrop-blur rounded-2xl shadow-2xl border-4 border-blue-900 p-8">
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full bg-gray-900 text-blue-50 flex items-center justify-center border-4 border-blue-900 mb-3"
            style={{ fontFamily: "serif", fontSize: 32, fontWeight: 700 }}
          >
            將
          </div>
          <h1 className="text-2xl font-bold text-blue-900">Đăng Ký</h1>
          <p className="text-sm text-blue-800/70">
            Tham gia cộng đồng cờ tướng
          </p>
        </div>

        <div className="space-y-4">
          <Field
            icon={<User className="w-4 h-4 text-blue-700" />}
            label="Tên người chơi"
          >
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cao_thu_2026"
              className="flex-1 outline-none bg-transparent text-blue-900"
            />
          </Field>

          <Field
            icon={<Mail className="w-4 h-4 text-blue-700" />}
            label="Email"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 outline-none bg-transparent text-blue-900"
            />
          </Field>

          <Field
            icon={<Lock className="w-4 h-4 text-blue-700" />}
            label="Mật khẩu"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex-1 outline-none bg-transparent text-blue-900"
            />
          </Field>

          {strength && (
            <div className="text-xs">
              Độ mạnh:{" "}
              <span
                className={
                  strength === "Mạnh"
                    ? "text-green-700"
                    : strength === "Trung bình"
                      ? "text-blue-700"
                      : "text-red-700"
                }
              >
                <strong>{strength}</strong>
              </span>
            </div>
          )}

          <Field
            icon={<Lock className="w-4 h-4 text-blue-700" />}
            label="Xác nhận mật khẩu"
          >
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="flex-1 outline-none bg-transparent text-blue-900"
            />
          </Field>
          {confirm && !pwdMatch && (
            <p className="text-xs text-red-700">Mật khẩu không khớp</p>
          )}

          <label className="flex items-start gap-2 text-sm text-blue-900">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />
            <span>
              Tôi đồng ý với{" "}
              <a className="text-blue-700 font-semibold hover:underline">
                Điều khoản
              </a>{" "}
              và{" "}
              <a className="text-blue-700 font-semibold hover:underline">
                Chính sách bảo mật
              </a>
              .
            </span>
          </label>

          <button
            disabled={!canSubmit}
            onClick={() =>
              canSubmit && onRegister?.({ username, email, password })
            }
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 disabled:text-blue-700 text-blue-50 rounded-lg font-bold shadow-lg"
          >
            <UserPlus className="w-5 h-5" /> Tạo tài khoản
          </button>

          <p className="text-center text-sm text-blue-800">
            Đã có tài khoản?{" "}
            <button
              onClick={() => onNavigate?.("login")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Đăng nhập
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

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-blue-900">{label}</span>
      <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-blue-300 focus-within:border-blue-700">
        {icon}
        {children}
      </div>
    </label>
  );
}
