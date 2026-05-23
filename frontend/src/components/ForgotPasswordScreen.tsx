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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-blue-800 to-cyan-800 p-4">
      <div className="w-full max-w-md bg-blue-50/95 backdrop-blur rounded-2xl shadow-2xl border-4 border-blue-900 p-8">
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center border-4 border-blue-900 mb-3"
            style={{ fontFamily: "serif", fontSize: 32, fontWeight: 700 }}
          >
            仕
          </div>
          <h1 className="text-2xl font-bold text-blue-900">Quên Mật Khẩu</h1>
          <p className="text-sm text-blue-800/70">
            Chúng tôi sẽ gửi liên kết khôi phục về email của bạn
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
            <p className="text-blue-900">
              Đã gửi liên kết khôi phục đến <strong>{email}</strong>.
            </p>
            <p className="text-sm text-blue-800/70">
              Kiểm tra hộp thư đến (và cả thư rác) trong vài phút tới.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-blue-700 font-semibold hover:underline"
            >
              Gửi lại
            </button>
            <button
              onClick={() => onNavigate?.("login")}
              className="block w-full py-3 bg-blue-700 hover:bg-blue-800 text-blue-50 rounded-lg font-bold"
            >
              Quay về đăng nhập
            </button>
          </div>
        ) : (
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

            <button
              onClick={submit}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-800 text-blue-50 rounded-lg font-bold shadow-lg"
            >
              <Send className="w-5 h-5" /> Gửi liên kết
            </button>

            <p className="text-center text-sm text-blue-800">
              Nhớ ra mật khẩu rồi?{" "}
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
        )}
      </div>
    </div>
  );
}
