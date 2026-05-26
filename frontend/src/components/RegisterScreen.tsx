import { useState } from "react";
import { Mail, Lock, UserPlus } from "lucide-react";
import { Toggle } from "./ui";

interface RegisterScreenProps {
  onBack?: () => void;
  onRegister?: (data: { email: string; password: string }) => void;
  onNavigate?: (screen: "login") => void;
}

export default function RegisterScreen({
  onBack,
  onRegister,
  onNavigate,
}: RegisterScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const pwdMatch = password.length > 0 && password === confirm;
  const canSubmit = email && pwdMatch && agree;

  const strength =
    password.length >= 10
      ? "Mạnh"
      : password.length >= 6
        ? "Trung bình"
        : password.length > 0
          ? "Yếu"
          : "";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 animate-fade-in">
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center border-2 border-primary mb-3"
            style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 700 }}
          >
            將
          </div>
          <h1 className="text-2xl font-bold font-heading text-main">Đăng Ký</h1>
          <p className="text-sm text-muted">Tham gia cộng đồng cờ tướng</p>
        </div>

        <div className="space-y-4">
          <Field icon={<Mail className="w-4 h-4 text-primary" />} label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 outline-none bg-transparent text-main placeholder:text-muted"
            />
          </Field>

          <Field
            icon={<Lock className="w-4 h-4 text-primary" />}
            label="Mật khẩu"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex-1 outline-none bg-transparent text-main placeholder:text-muted"
            />
          </Field>

          {strength && (
            <div className="text-xs">
              Độ mạnh:{" "}
              <span
                className={
                  strength === "Mạnh"
                    ? "text-success"
                    : strength === "Trung bình"
                      ? "text-accent"
                      : "text-danger"
                }
              >
                <strong>{strength}</strong>
              </span>
            </div>
          )}

          <Field
            icon={<Lock className="w-4 h-4 text-primary" />}
            label="Xác nhận mật khẩu"
          >
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="flex-1 outline-none bg-transparent text-main placeholder:text-muted"
            />
          </Field>
          {confirm && !pwdMatch && (
            <p className="text-xs text-danger">Mật khẩu không khớp</p>
          )}

          <label className="flex items-start gap-2 text-sm text-main cursor-pointer">
            <Toggle
              isChecked={agree}
              onChange={setAgree}
              size="sm"
              aria-label="Tôi đồng ý với điều khoản và chính sách bảo mật"
            />
            <span>
              Tôi đồng ý với{" "}
              <a className="text-primary font-semibold hover:text-primary-hover transition-colors">
                Điều khoản
              </a>{" "}
              và{" "}
              <a className="text-primary font-semibold hover:text-primary-hover transition-colors">
                Chính sách bảo mật
              </a>
              .
            </span>
          </label>

          <button
            disabled={!canSubmit}
            onClick={() => canSubmit && onRegister?.({ email, password })}
            className="w-full btn-primary py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-5 h-5" /> Tạo tài khoản
          </button>

          <p className="text-center text-sm text-muted">
            Đã có tài khoản?{" "}
            <button
              onClick={() => onNavigate?.("login")}
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              Đăng nhập
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
      <span className="text-sm font-semibold text-main">{label}</span>
      <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-surface-opaque rounded-lg border border-border focus-within:border-primary transition-colors">
        {icon}
        {children}
      </div>
    </label>
  );
}
