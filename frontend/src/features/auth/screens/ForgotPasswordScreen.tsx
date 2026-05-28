import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Card, Button, Input, Text } from "@shared/components/ui";

interface ForgotPasswordScreenProps {
  onBack?: () => void;
  onSent?: (email: string) => void;
  onNavigate?: (screen: "login") => void;
}

export default function ForgotPasswordScreen({
  onBack,
  onSent,
  onNavigate,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!email) return;
    setSent(true);
    onSent?.(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card variant="elevated" padding="lg" className="w-full max-w-md animate-fade-in">
        <Card.Header className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center border-2 border-primary mb-3"
            style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 700 }}
          >
            仕
          </div>
          <Text variant="h2" className="text-main">Quên Mật Khẩu</Text>
          <Text variant="caption" className="text-muted">
            Chúng tôi sẽ gửi liên kết khôi phục về email của bạn
          </Text>
        </Card.Header>

        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto animate-fade-in" />
            <Text variant="body" className="text-main">
              Đã gửi liên kết khôi phục đến <strong>{email}</strong>.
            </Text>
            <Text variant="caption" className="text-muted">
              Kiểm tra hộp thư đến (và cả thư rác) trong vài phút tới.
            </Text>
            <Button
              variant="ghost"
              onClick={() => setSent(false)}
            >
              Gửi lại
            </Button>
            <Button
              variant="primary"
              onClick={() => onNavigate?.("login")}
              className="w-full"
            >
              Quay về đăng nhập
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <Button
              variant="primary"
              onClick={submit}
              className="w-full flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> Gửi liên kết
            </Button>

            <Text variant="body" className="text-center text-sm text-muted">
              Nhớ ra mật khẩu rồi?{" "}
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
        )}
      </Card>
    </div>
  );
}
