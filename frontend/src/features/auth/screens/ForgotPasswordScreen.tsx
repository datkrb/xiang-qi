import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

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
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 animate-fade-in">
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center border-2 border-primary mb-3"
            style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 700 }}
          >
            仕
          </div>
          <h1 className="text-2xl font-bold font-heading text-main">Quên Mật Khẩu</h1>
          <p className="text-sm text-muted">
            Chúng tôi sẽ gửi liên kết khôi phục về email của bạn
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto animate-fade-in" />
            <p className="text-main">
              Đã gửi liên kết khôi phục đến <strong>{email}</strong>.
            </p>
            <p className="text-sm text-muted">
              Kiểm tra hộp thư đến (và cả thư rác) trong vài phút tới.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              Gửi lại
            </button>
            <button
              onClick={() => onNavigate?.("login")}
              className="block w-full py-3 btn-primary rounded-lg font-bold"
            >
              Quay về đăng nhập
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
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

            <button
              onClick={submit}
              className="w-full btn-primary py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> Gửi liên kết
            </button>

            <p className="text-center text-sm text-muted">
              Nhớ ra mật khẩu rồi?{" "}
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
        )}
      </div>
    </div>
  );
}
