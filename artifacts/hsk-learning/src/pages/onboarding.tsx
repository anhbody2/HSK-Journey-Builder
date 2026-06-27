import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCompleteOnboarding } from "@workspace/api-client-react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PLACEMENT_QUESTIONS = [
  {
    id: 1,
    question: '"你好" (nǐ hǎo) có nghĩa là gì?',
    options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
    correct: 0,
  },
  {
    id: 2,
    question: '"我" (wǒ) là đại từ chỉ ai?',
    options: ["Bạn", "Tôi", "Anh ấy", "Chúng tôi"],
    correct: 1,
  },
  {
    id: 3,
    question: '"多少钱" (duōshao qián) có nghĩa là gì?',
    options: ["Mấy giờ rồi?", "Bao nhiêu tiền?", "Bạn tên gì?", "Ở đâu?"],
    correct: 1,
  },
  {
    id: 4,
    question: 'Thanh điệu nào là thanh bằng (ngang)?',
    options: ["mā", "má", "mǎ", "mà"],
    correct: 0,
  },
  {
    id: 5,
    question: '"我爱你" (wǒ ài nǐ) có nghĩa là gì?',
    options: ["Tôi ghét bạn", "Tôi sợ bạn", "Tôi yêu bạn", "Tôi nhớ bạn"],
    correct: 2,
  },
];

const HSK_LEVELS = [
  { level: 1, label: "HSK 1", desc: "Mới bắt đầu — Từ vựng cơ bản (500 từ)" },
  { level: 2, label: "HSK 2", desc: "Sơ cấp — Giao tiếp hàng ngày (1500 từ)" },
  { level: 3, label: "HSK 3", desc: "Trung cấp — Xử lý tình huống phức tạp (2500 từ)" },
  { level: 4, label: "HSK 4", desc: "Cao trung — Thảo luận chủ đề rộng (5000 từ)" },
  { level: 5, label: "HSK 5", desc: "Cao cấp — Đọc báo, văn học (7500 từ)" },
];

const DAILY_GOALS = [
  { minutes: 5, label: "5 phút / ngày", desc: "Nhẹ nhàng" },
  { minutes: 10, label: "10 phút / ngày", desc: "Cân bằng" },
  { minutes: 15, label: "15 phút / ngày", desc: "Hiệu quả" },
  { minutes: 30, label: "30 phút / ngày", desc: "Chăm chỉ" },
];

type Step = "welcome" | "quiz" | "name" | "goal" | "level" | "result";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState(3);
  const [dailyGoal, setDailyGoal] = useState(15);
  const completeOnboarding = useCompleteOnboarding();

  const correctCount = quizAnswers.filter((a, i) => a === PLACEMENT_QUESTIONS[i]?.correct).length;
  const recommendedLevel = correctCount <= 1 ? 1 : correctCount <= 3 ? 2 : 3;

  function handleQuizAnswer(optionIdx: number) {
    const newAnswers = [...quizAnswers, optionIdx];
    setQuizAnswers(newAnswers);
    if (currentQ < PLACEMENT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 400);
    } else {
      setTimeout(() => setStep("name"), 400);
    }
  }

async function handleFinish() {
    // TẠM THỜI TẮT GỌI API ĐỂ BYPASS LỖI 404
    /*
    await completeOnboarding.mutateAsync({
      data: {
        name: name || "Học viên",
        targetLevel: selectedTarget,
        placementScore: correctCount,
        recommendedLevel,
        dailyGoalMinutes: dailyGoal,
      },
    });
    */

    // Fake data vào localStorage lỡ các component khác ở Mainpage/Dashboard cần gọi ra dùng
    localStorage.setItem("hsk_onboarding_completed", "true");
    localStorage.setItem("hsk_user_name", name || "Học viên");
    localStorage.setItem("hsk_target_level", selectedTarget.toString());
    localStorage.setItem("hsk_daily_goal", dailyGoal.toString());

    // Ép chuyển thẳng sang trang chính
    setLocation("/dashboard");
  }

  const steps: Step[] = ["welcome", "quiz", "name", "goal", "level", "result"];
  const stepIndex = steps.indexOf(step);
  const progress = ((stepIndex) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {step !== "welcome" && (
        <div className="w-full px-6 pt-6">
          <Progress value={progress} className="h-1.5 bg-muted" />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">

          {/* WELCOME */}
          {step === "welcome" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-5xl mx-auto shadow-lg">
                汉
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-3">Chào mừng đến HSK Smart Learning</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Hãy để chúng tôi đánh giá trình độ và xây dựng lộ trình học tập phù hợp nhất cho bạn.
                </p>
              </div>
              <div className="space-y-3 text-left bg-card border rounded-2xl p-5">
                {["Bài kiểm tra năng lực đầu vào (5 câu hỏi)", "Thiết lập mục tiêu học tập", "Nhận lộ trình cá nhân hóa"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="w-full h-14 text-base rounded-xl" onClick={() => setStep("quiz")}>
                Bắt đầu đánh giá <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

          {/* QUIZ */}
          {step === "quiz" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Câu {currentQ + 1} / {PLACEMENT_QUESTIONS.length}</span>
                <span className="text-sm font-medium text-muted-foreground">Đánh giá năng lực</span>
              </div>
              <div className="bg-card border rounded-2xl p-6">
                <p className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
                  {PLACEMENT_QUESTIONS[currentQ].question}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {PLACEMENT_QUESTIONS[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      data-testid={`quiz-option-${i}`}
                      onClick={() => handleQuizAnswer(i)}
                      disabled={quizAnswers.length > currentQ}
                      className={cn(
                        "py-3 px-4 rounded-xl border text-sm font-medium text-left transition-all",
                        quizAnswers[currentQ] === i
                          ? i === PLACEMENT_QUESTIONS[currentQ].correct
                            ? "bg-green-100 border-green-400 text-green-800"
                            : "bg-red-100 border-red-400 text-red-800"
                          : "bg-background border-border hover:border-primary hover:bg-primary/5 cursor-pointer"
                      )}
                    >
                      <span className="text-primary font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NAME */}
          {step === "name" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Bạn tên gì?</h2>
                <p className="text-muted-foreground">Chúng tôi sẽ cá nhân hóa trải nghiệm cho bạn.</p>
              </div>
              <div>
                <input
                  data-testid="input-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="w-full h-14 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  onKeyDown={e => e.key === "Enter" && name.trim() && setStep("goal")}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep("quiz")}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
                </Button>
                <Button className="flex-1 h-12 rounded-xl" onClick={() => setStep("goal")} disabled={!name.trim()}>
                  Tiếp theo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* DAILY GOAL */}
          {step === "goal" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Mục tiêu hàng ngày</h2>
                <p className="text-muted-foreground">Chọn thời gian học phù hợp với lịch trình của bạn.</p>
              </div>
              <div className="space-y-3">
                {DAILY_GOALS.map(g => (
                  <button
                    key={g.minutes}
                    data-testid={`goal-${g.minutes}`}
                    onClick={() => setDailyGoal(g.minutes)}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 rounded-xl border text-left transition-all",
                      dailyGoal === g.minutes
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div>
                      <p className="font-semibold text-base">{g.label}</p>
                      <p className="text-sm text-muted-foreground">{g.desc}</p>
                    </div>
                    {dailyGoal === g.minutes && <CheckCircle className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep("name")}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
                </Button>
                <Button className="flex-1 h-12 rounded-xl" onClick={() => setStep("level")}>
                  Tiếp theo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* TARGET LEVEL */}
          {step === "level" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Mục tiêu HSK của bạn</h2>
                <p className="text-muted-foreground">Kết quả đánh giá gợi ý bạn bắt đầu từ HSK {recommendedLevel}.</p>
              </div>
              <div className="space-y-3">
                {HSK_LEVELS.map(l => (
                  <button
                    key={l.level}
                    data-testid={`level-${l.level}`}
                    onClick={() => setSelectedTarget(l.level)}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 rounded-xl border text-left transition-all",
                      selectedTarget === l.level
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold",
                        selectedTarget === l.level ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>{l.label.split(" ")[1]}</span>
                      <div>
                        <p className="font-semibold text-sm">{l.label}</p>
                        <p className="text-xs text-muted-foreground">{l.desc}</p>
                      </div>
                    </div>
                    {selectedTarget === l.level && <CheckCircle className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep("goal")}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
                </Button>
                <Button className="flex-1 h-12 rounded-xl" onClick={() => setStep("result")}>
                  Xem kết quả <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* RESULT */}
          {step === "result" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Lộ trình của {name || "bạn"} đã sẵn sàng!</h2>
                <p className="text-muted-foreground">Dựa trên đánh giá, chúng tôi đề xuất lộ trình sau:</p>
              </div>
              <div className="bg-card border rounded-2xl p-6 text-left space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Kết quả kiểm tra</span>
                  <span className="font-semibold text-primary">{correctCount}/{PLACEMENT_QUESTIONS.length} đúng</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Bắt đầu từ</span>
                  <span className="font-semibold">HSK {recommendedLevel}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Mục tiêu</span>
                  <span className="font-semibold">HSK {selectedTarget}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Học mỗi ngày</span>
                  <span className="font-semibold">{dailyGoal} phút</span>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full h-14 text-base rounded-xl"
                onClick={handleFinish}
                disabled={completeOnboarding.isPending}
                data-testid="button-start-learning"
              >
                {completeOnboarding.isPending ? "Đang xử lý..." : "Bắt đầu học ngay"} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
