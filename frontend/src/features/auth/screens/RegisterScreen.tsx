import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Toggle, Card, Button, Text, Input } from "@shared/components/ui";

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
      <Card variant="elevated" padding="lg" className="w-full max-w-md animate-fade-in">
        <Card.Header className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center border-2 border-primary mb-3"
            style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 700 }}
          >
            將
          </div>
          <Text variant="h2" className="text-main">Đăng Ký</Text>
          <Text variant="caption" className="text-muted">Tham gia cộng đồng cờ tướng</Text>
        </Card.Header>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

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

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            validationState={confirm && !pwdMatch ? "error" : "default"}
            errorMessage={confirm && !pwdMatch ? "Mật khẩu không khớp" : undefined}
          />

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

          <Button
            variant="primary"
            disabled={!canSubmit}
            onClick={() => canSubmit && onRegister?.({ email, password })}
            className="w-full flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" /> Tạo tài khoản
          </Button>

          <Text variant="body" className="text-center text-sm text-muted">
            Đã có tài khoản?{" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.("login")}
              style={{ padding: 0, display: "inline" }}
            >
              Đăng nhập
            </Button>
          </Text>

          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full text-center text-sm mt-2"
            >
              ← Quay lại
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

