import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button, Input, Card, Text } from "./ui";

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
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onLogin?.({ email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Card
        variant="elevated"
        padding="lg"
        className="w-full max-w-md animate-fade-in"
      >
        <Card.Header>
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
                fontFamily: "Outfit",
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              帥
            </div>
            <Text variant="h2">Đăng Nhập</Text>
            <Text variant="caption">Chào mừng trở lại bàn cờ!</Text>
          </div>
        </Card.Header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            validationState={errors.email ? "error" : "default"}
            errorMessage={errors.email}
          />

          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            validationState={errors.password ? "error" : "default"}
            errorMessage={errors.password}
          />

          <div className="flex items-center justify-between text-sm">
            <label
              className="flex items-center gap-2 cursor-pointer"
              style={{ color: "var(--color-text-main)" }}
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Ghi nhớ tôi
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.("forgot")}
            >
              Quên mật khẩu?
            </Button>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            <LogIn className="w-4 h-4 mr-2 inline" /> Đăng nhập
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => onGuestPlay?.()}
            className="w-full"
          >
            Chơi với tư cách khách
          </Button>

          <div className="flex items-center gap-2 my-2 opacity-50">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--color-border)" }}
            />
            <Text variant="caption">HOẶC</Text>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--color-border)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" size="sm">
              Google
            </Button>
            <Button type="button" variant="secondary" size="sm">
              Facebook
            </Button>
          </div>

          <Text variant="body" className="text-center">
            Chưa có tài khoản?{" "}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.("register")}
              style={{ padding: "0", display: "inline" }}
            >
              Đăng ký ngay
            </Button>
          </Text>

          {onBack && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onBack}
            >
              ← Quay lại
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
}
