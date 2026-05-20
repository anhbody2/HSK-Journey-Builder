import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCheckpoint,
  getGetCheckpointQueryKey,
  useSubmitQuiz,
} from "@workspace/api-client-react";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CheckpointPage() {
  const [, params] = useRoute("/checkpoint/:level");
  const [, setLocation] = useLocation();
  const level = parseInt(params?.level ?? "1");

  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { data: quiz, isLoading } = useGetCheckpoint(level, {
    query: { enabled: !!level, queryKey: getGetCheckpointQueryKey(level) },
  });

  const submitQuiz = useSubmitQuiz();

  useEffect(() => {
    if (quiz?.timeLimit) {
      setTimeLeft(quiz.timeLimit);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result) return;
    const t = setTimeout(() => setTimeLeft(s => (s ?? 0) - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result]);

  async function handleSubmit() {
    if (!quiz) return;
    const ans = quiz.questions.map((q: any) => ({
      questionId: q.id,
      answer: answers[q.id] ?? "",
    }));
    const res = await submitQuiz.mutateAsync({ data: { quizId: quiz.id, answers: ans } });
    setResult(res);
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const questions = (quiz?.questions ?? []) as any[];
  const currentQ = questions[qIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (qIdx / questions.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
              result.passed ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
            )}>
              {result.passed ? <Trophy className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {result.passed ? "Chúc mừng! Bạn đã vượt qua!" : "Chưa đạt — Hãy ôn tập thêm!"}
            </h1>
            <p className="text-muted-foreground">Kết quả bài thi HSK {level}</p>
          </div>

          <div className="bg-card border rounded-2xl p-6 space-y-4">
            <div className="text-center mb-2">
              <p className="text-5xl font-bold text-primary" data-testid="text-checkpoint-score">{result.score}</p>
              <p className="text-muted-foreground text-sm mt-1">điểm / 100</p>
            </div>
            <div className="flex justify-between text-sm border-t pt-4">
              <span className="text-muted-foreground">Câu đúng</span>
              <span className="font-semibold text-green-600">{result.correctCount} / {result.totalCount}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-4">
              <span className="text-muted-foreground">XP nhận được</span>
              <span className="font-semibold text-yellow-600">+{result.xpEarned} XP</span>
            </div>
          </div>

          <div className="space-y-2">
            {result.questionResults?.map((r: any, i: number) => (
              <div key={i} className={cn(
                "flex items-start gap-3 p-3 rounded-xl border text-sm",
                r.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              )}>
                {r.isCorrect
                  ? <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-xs text-muted-foreground">Câu {i + 1}</p>
                  {!r.isCorrect && (
                    <p className="text-xs">Đáp án đúng: <span className="font-semibold">{r.correctAnswer}</span></p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setLocation("/dashboard")}>
              Về trang chủ
            </Button>
            {result.passed && (
              <Button className="flex-1 h-12 rounded-xl" onClick={() => setLocation(`/learn/${level + 1}`)}>
                HSK {level + 1} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-5 pb-3">
        <button
          data-testid="button-back"
          onClick={() => setLocation(`/learn/${level}`)}
          className="p-2 rounded-lg hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        {timeLeft !== null && (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold",
            timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground"
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="flex-1 px-5 py-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="font-bold text-lg">Bài thi chuẩn HSK {level}</h2>
          <p className="text-sm text-muted-foreground">Câu {qIdx + 1} / {questions.length} · {answeredCount} đã trả lời</p>
        </div>

        {currentQ && (
          <div className="space-y-4">
            <div className="bg-card border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {currentQ.type === "pinyin_input" ? "Nhập Pinyin" :
                    currentQ.type === "translation_choice" ? "Chọn nghĩa" :
                      currentQ.type === "tone_selection" ? "Chọn thanh điệu" :
                        currentQ.type === "matching" ? "Ghép từ" : "Trắc nghiệm"}
                </span>
                <span className="text-xs text-muted-foreground">#{qIdx + 1}</span>
              </div>
              <p className="font-semibold text-base leading-relaxed mb-5">{currentQ.question}</p>

              {currentQ.type === "pinyin_input" ? (
                <input
                  data-testid={`checkpoint-input-${currentQ.id}`}
                  type="text"
                  placeholder="Nhập Pinyin (vd: nǐ hǎo)..."
                  value={answers[currentQ.id] ?? ""}
                  onChange={e => setAnswers(a => ({ ...a, [currentQ.id]: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : currentQ.options ? (
                <div className="space-y-2">
                  {currentQ.options.map((opt: string, j: number) => (
                    <button
                      key={j}
                      data-testid={`checkpoint-opt-${currentQ.id}-${j}`}
                      onClick={() => setAnswers(a => ({ ...a, [currentQ.id]: opt }))}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border transition-all text-sm",
                        answers[currentQ.id] === opt
                          ? "bg-primary/10 border-primary text-primary font-medium"
                          : "bg-background border-border hover:border-primary/40"
                      )}
                    >
                      <span className="font-bold text-primary mr-2">{String.fromCharCode(65 + j)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                disabled={qIdx === 0}
                onClick={() => setQIdx(q => q - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Câu trước
              </Button>
              {qIdx < questions.length - 1 ? (
                <Button className="flex-1 h-11 rounded-xl" onClick={() => setQIdx(q => q + 1)}>
                  Câu tiếp <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="flex-1 h-11 rounded-xl bg-green-600 hover:bg-green-700"
                  onClick={handleSubmit}
                  disabled={submitQuiz.isPending}
                  data-testid="button-submit-checkpoint"
                >
                  {submitQuiz.isPending ? "Đang nộp..." : "Nộp bài"} <CheckCircle className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Question dots nav */}
            <div className="flex flex-wrap gap-1.5 justify-center pt-2">
              {questions.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setQIdx(i)}
                  className={cn(
                    "w-7 h-7 rounded-full text-xs font-medium transition-all",
                    i === qIdx ? "bg-primary text-primary-foreground" :
                      answers[questions[i].id] ? "bg-green-200 text-green-800" :
                        "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
