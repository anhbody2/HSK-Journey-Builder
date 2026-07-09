import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useCompleteOnboarding } from "@workspace/api-client-react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Zap,
  Trophy,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingBackground } from "@/components/floating-background";

interface OnboardingData {
  name: string;
  targetLevel: number;
  recommendedLevel: number;
  dailyGoalMinutes: number;
  placementScore: number;
  totalQuestions: number;
}

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { signUp, signIn, user } = useAuth();
  const completeOnboarding = useCompleteOnboarding();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onboardingData: OnboardingData | null = (() => {
    try {
      const raw = sessionStorage.getItem("onboarding_data");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // If already logged in, go to dashboard
  useEffect(() => {
    if (user) setLocation("/dashboard");
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } =
      mode === "signup"
        ? await signUp(email, password)
        : await signIn(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    // New sign-up → send to onboarding to collect name/goal/level
    // Existing login → if they already have onboarding data from quiz, save it; else go to dashboard
    if (mode === "signup") {
      setLocation("/onboarding");
      return;
    }

    // Login: save onboarding profile if coming from quiz
    if (onboardingData) {
      try {
        await completeOnboarding.mutateAsync({
          data: {
            name: onboardingData.name,
            targetLevel: onboardingData.targetLevel,
            recommendedLevel: onboardingData.recommendedLevel,
            dailyGoalMinutes: onboardingData.dailyGoalMinutes,
            placementScore: onboardingData.placementScore,
          },
        });
        sessionStorage.removeItem("onboarding_data");
      } catch {
        /* non-fatal */
      }
    }

    setLocation("/dashboard");
  }

  async function handleSkip() {
    // Save onboarding data without auth, then go to dashboard
    if (onboardingData) {
      try {
        await completeOnboarding.mutateAsync({
          data: {
            name: onboardingData.name,
            targetLevel: onboardingData.targetLevel,
            recommendedLevel: onboardingData.recommendedLevel,
            dailyGoalMinutes: onboardingData.dailyGoalMinutes,
            placementScore: onboardingData.placementScore,
          },
        });
        sessionStorage.removeItem("onboarding_data");
      } catch {
        /* non-fatal */
      }
    }
    setLocation("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      <FloatingBackground />

      {/* Left panel — branding / quiz results */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-primary/5 border-r border-border/40 p-12 relative overflow-hidden">
        <div className="flex items-center gap-2 z-10 relative">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-2xl">
            汉
          </div>
          <span className="font-bold text-xl tracking-tight">
            HSK Smart Learning
          </span>
        </div>

        <div className="space-y-8 z-10 relative">
          {onboardingData ? (
            <>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-sm font-medium mb-4">
                  <CheckCircle className="w-4 h-4" /> Đánh giá hoàn tất
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-3">
                  Lộ trình của {onboardingData.name || "bạn"} đã sẵn sàng!
                </h2>
                <p className="text-muted-foreground text-lg">
                  Tạo tài khoản để lưu tiến độ và bắt đầu hành trình chinh phục
                  tiếng Trung.
                </p>
              </div>

              <div className="bg-card border rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">
                    Kết quả kiểm tra
                  </span>
                  <span className="font-semibold text-primary">
                    {onboardingData.placementScore}/
                    {onboardingData.totalQuestions ?? 5} đúng
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">
                    Bắt đầu từ
                  </span>
                  <span className="font-semibold">
                    HSK {onboardingData.recommendedLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">
                    Mục tiêu
                  </span>
                  <span className="font-semibold">
                    HSK {onboardingData.targetLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">
                    Học mỗi ngày
                  </span>
                  <span className="font-semibold">
                    {onboardingData.dailyGoalMinutes} phút
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-3">
                  Chinh phục tiếng Trung cùng hàng nghìn học viên
                </h2>
                <p className="text-muted-foreground text-lg">
                  Lộ trình cá nhân hóa từ HSK 1 đến HSK 5 dành riêng cho người
                  Việt.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: BookOpen,
                    text: "Lộ trình học chuẩn HSK 3.0",
                    color: "text-blue-500 bg-blue-100 dark:bg-blue-950",
                  },
                  {
                    icon: Zap,
                    text: "Luyện nói AI — phân tích phát âm",
                    color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-950",
                  },
                  {
                    icon: Trophy,
                    text: "Bảng xếp hạng & thành tích",
                    color: "text-orange-500 bg-orange-100 dark:bg-orange-950",
                  },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        color,
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground z-10 relative">
          © 2026 HSK Smart Learning. Được thiết kế dành riêng cho người Việt.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 mb-6 justify-center lg:hidden">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-2xl">
                汉
              </div>
              <span className="font-bold text-xl tracking-tight">
                HSK Smart Learning
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {mode === "signup"
                ? "Tạo tài khoản miễn phí"
                : "Chào mừng trở lại"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "signup"
                ? "Lưu tiến độ học tập và đồng bộ mọi thiết bị."
                : "Đăng nhập để tiếp tục hành trình học tiếng Trung."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="_tencuaban_@example.com"
                required
                className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "signup" ? "Tối thiểu 6 ký tự" : "Nhập mật khẩu"
                  }
                  required
                  minLength={6}
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 rounded-xl text-base font-semibold"
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : mode === "signup"
                  ? "Tạo tài khoản"
                  : "Đăng nhập"}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">hoặc</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Skip */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 rounded-xl text-sm"
            onClick={handleSkip}
            disabled={loading}
          >
            Tiếp tục không cần tài khoản
          </Button>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === "signup" ? "login" : "signup"));
                setError(null);
              }}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "signup" ? "Đăng nhập" : "Đăng ký ngay"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
