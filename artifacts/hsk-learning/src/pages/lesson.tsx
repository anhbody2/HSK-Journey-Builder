import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetLesson,
  getGetLessonQueryKey,
  useUpdateLessonProgress,
  useScoreShadowing,
  useGenerateQuiz,
  useSubmitQuiz,
} from "@workspace/api-client-react";
import {
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  CheckCircle,
  XCircle,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "dialogue" | "vocabulary" | "shadowing" | "grammar" | "quiz";
const STEPS: Step[] = [
  "dialogue",
  "vocabulary",
  "shadowing",
  "grammar",
  "quiz",
];
const STEP_LABELS = [
  "Hội thoại",
  "Từ vựng",
  "Shadowing",
  "Ngữ pháp",
  "Mini-Quiz",
];

export default function LessonPage() {
  const [, params] = useRoute("/lesson/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id ?? "0");

  const [stepIdx, setStepIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [vocabIdx, setVocabIdx] = useState(0);
  const [quizData, setQuizData] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [shadowingResult, setShadowingResult] = useState<any>(null);

  const { data: lesson, isLoading } = useGetLesson(id, {
    query: { enabled: !!id, queryKey: getGetLessonQueryKey(id) },
  });

  const updateProgress = useUpdateLessonProgress();
  const scoreShadowing = useScoreShadowing();
  const generateQuiz = useGenerateQuiz();
  const submitQuiz = useSubmitQuiz();

  const currentStep = STEPS[stepIdx];
  const progress = (stepIdx / STEPS.length) * 100;

  async function handleStepComplete() {
    if (!lesson) return;
    await updateProgress.mutateAsync({
      lessonId: id,
      data: { step: currentStep!, isCompleted: true, score: null },
    });
    if (stepIdx < STEPS.length - 1) {
      if (STEPS[stepIdx + 1] === "quiz") {
        const quiz = await generateQuiz.mutateAsync({
          data: { lessonId: id, questionCount: 5 },
        });
        setQuizData(quiz);
      }
      setStepIdx((s) => s + 1);
      setVocabIdx(0);
      setShadowingResult(null);
    } else {
      setLocation("/dashboard");
    }
  }

  async function handleShadowing() {
    if (!lesson) return;
    setIsRecording(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsRecording(false);
    const result = await scoreShadowing.mutateAsync({
      data: {
        lessonId: id,
        audioBase64: "",
        targetText: lesson.shadowingText,
        targetPinyin: lesson.shadowingPinyin,
      },
    });
    setShadowingResult(result);
  }

  async function handleQuizSubmit() {
    if (!quizData) return;
    const answers = quizData.questions.map((q: any) => ({
      questionId: q.id,
      answer: quizAnswers[q.id] ?? "",
    }));
    const result = await submitQuiz.mutateAsync({
      data: { quizId: quizData.id, answers },
    });
    setQuizResult(result);
    await updateProgress.mutateAsync({
      lessonId: id,
      data: { step: "quiz", isCompleted: true, score: result.score },
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy bài học.</p>
      </div>
    );
  }

  const dialogue = lesson.dialogue as any[];
  const vocabulary = lesson.vocabulary as any[];
  const grammarPoints = lesson.grammarPoints as any[];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-5 pt-5 pb-3">
        <button
          data-testid="button-back"
          onClick={() => setLocation(`/learn/${lesson.level}`)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {stepIdx + 1}/{STEPS.length}
        </span>
      </div>

      {/* Step tabs */}
      <div className="flex gap-1 px-5 pb-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              "flex-1 h-1 rounded-full transition-all",
              i < stepIdx
                ? "bg-primary"
                : i === stepIdx
                  ? "bg-primary/60"
                  : "bg-muted",
            )}
          />
        ))}
      </div>

      <div className="flex-1 px-5 py-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-1">{lesson.title}</h2>
        <p className="text-sm text-primary font-medium font-serif mb-5">
          {lesson.titleChinese}
        </p>

        {/* DIALOGUE STEP */}
        {currentStep === "dialogue" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Hội thoại
            </p>
            {dialogue.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Bài học này không có hội thoại.
              </p>
            ) : (
              dialogue.map((line: any, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    i % 2 === 1 && "flex-row-reverse",
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {line.speaker.charAt(0)}
                  </div>
                  <div
                    className={cn(
                      "flex-1 bg-card border rounded-2xl p-4 max-w-[30%]",
                      i % 2 === 1 && "items-end",
                    )}
                  >
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      {line.speaker}
                    </p>
                    <p className="text-lg font-semibold text-foreground font-serif">
                      {line.chinese}
                    </p>
                    <p className="text-sm text-primary mt-1">{line.pinyin}</p>
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      {line.translation}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VOCABULARY STEP */}
        {currentStep === "vocabulary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Từ vựng
              </p>
              <span className="text-sm text-muted-foreground">
                {vocabIdx + 1} / {vocabulary.length}
              </span>
            </div>
            {vocabulary.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Bài học này không có từ vựng mới.
              </p>
            ) : (
              <>
                <div className="bg-card border rounded-2xl p-6 text-center min-h-52 flex flex-col justify-center">
                  <p className="text-6xl font-serif font-bold text-foreground mb-3">
                    {vocabulary[vocabIdx]?.chinese}
                  </p>
                  <p className="text-xl text-primary font-medium mb-1">
                    {vocabulary[vocabIdx]?.pinyin}
                  </p>
                  <div className="inline-flex items-center justify-center gap-1 mb-3">
                    {Array.from({ length: 4 }).map((_, t) => (
                      <div
                        key={t}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          t + 1 === vocabulary[vocabIdx]?.tone
                            ? "bg-primary"
                            : "bg-muted",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {vocabulary[vocabIdx]?.translation}
                  </p>
                  <div className="mt-4 pt-4 border-t text-left">
                    <p className="text-sm text-foreground">
                      {vocabulary[vocabIdx]?.exampleSentence}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {vocabulary[vocabIdx]?.exampleTranslation}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 rounded-xl"
                    disabled={vocabIdx === 0}
                    onClick={() => setVocabIdx((v) => v - 1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Trước
                  </Button>
                  {vocabIdx < vocabulary.length - 1 ? (
                    <Button
                      className="flex-1 h-11 rounded-xl"
                      onClick={() => setVocabIdx((v) => v + 1)}
                    >
                      Tiếp <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 h-11 rounded-xl bg-green-600 hover:bg-green-700"
                      onClick={handleStepComplete}
                    >
                      Hoàn thành <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
                {vocabIdx < vocabulary.length - 1 && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleStepComplete}
                  >
                    Bỏ qua tất cả
                  </Button>
                )}
              </>
            )}
          </div>
        )}

        {/* SHADOWING STEP */}
        {currentStep === "shadowing" && (
          <div className="space-y-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Luyện phát âm
            </p>
            <div className="bg-card border rounded-2xl p-5">
              <p className="text-base font-medium text-foreground mb-1">
                Câu luyện tập:
              </p>
              <p className="text-2xl font-serif font-bold text-foreground mb-2">
                {lesson.shadowingText}
              </p>
              <p className="text-sm text-primary">{lesson.shadowingPinyin}</p>
            </div>

            {!shadowingResult ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <button
                  data-testid="button-record"
                  onClick={handleShadowing}
                  disabled={scoreShadowing.isPending || isRecording}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg",
                    isRecording
                      ? "bg-red-500 text-white animate-pulse scale-110"
                      : "bg-primary text-primary-foreground hover:scale-105",
                  )}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </button>
                <p className="text-sm text-muted-foreground">
                  {isRecording
                    ? "Đang thu âm..."
                    : scoreShadowing.isPending
                      ? "Đang phân tích..."
                      : "Nhấn để thu âm"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border",
                    shadowingResult.passed
                      ? "bg-green-50 border-green-200"
                      : "bg-orange-50 border-orange-200",
                  )}
                >
                  <div>
                    <p className="font-bold text-3xl">
                      {shadowingResult.overallScore}
                      <span className="text-base font-normal text-muted-foreground">
                        /100
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {shadowingResult.passed
                        ? "Tốt! Tiếp tục phát huy."
                        : "Hãy thử lại!"}
                    </p>
                  </div>
                  {shadowingResult.passed ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-orange-500" />
                  )}
                </div>

                <div className="bg-card border rounded-2xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                    Phân tích từng âm tiết:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {shadowingResult.syllableFeedback?.map(
                      (s: any, i: number) => (
                        <div
                          key={i}
                          data-testid={`syllable-${i}`}
                          className={cn(
                            "flex flex-col items-center px-3 py-2 rounded-lg border",
                            s.color === "green" &&
                              "bg-green-100 border-green-300 text-green-800",
                            s.color === "yellow" &&
                              "bg-yellow-100 border-yellow-300 text-yellow-800",
                            s.color === "red" &&
                              "bg-red-100 border-red-300 text-red-800",
                          )}
                        >
                          <span className="text-lg font-serif font-bold">
                            {s.syllable}
                          </span>
                          <span className="text-xs">{s.pinyin}</span>
                          {s.errorType && (
                            <span className="text-[10px] mt-0.5 opacity-75">
                              {s.errorType}
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {shadowingResult.tips?.length > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-primary mb-2">
                      Gợi ý cải thiện:
                    </p>
                    {shadowingResult.tips.map((tip: string, i: number) => (
                      <p key={i} className="text-sm text-foreground">
                        {tip}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 rounded-xl"
                    onClick={() => setShadowingResult(null)}
                  >
                    Thử lại
                  </Button>
                  <Button
                    className="flex-1 h-11 rounded-xl"
                    onClick={handleStepComplete}
                  >
                    Tiếp tục <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GRAMMAR STEP */}
        {currentStep === "grammar" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Ngữ pháp
            </p>
            {grammarPoints.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Bài học này không có điểm ngữ pháp mới.
              </p>
            ) : (
              grammarPoints.map((gp: any, i: number) => (
                <div
                  key={i}
                  className="bg-card border rounded-2xl p-5 space-y-4"
                >
                  <div className="bg-primary/10 rounded-xl px-4 py-2 inline-block">
                    <p className="text-primary font-semibold font-serif text-base">
                      {gp.pattern}
                    </p>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {gp.explanation}
                  </p>
                  <div className="space-y-3 border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Ví dụ thực tế:
                    </p>
                    {gp.examples?.map((ex: any, j: number) => (
                      <div
                        key={j}
                        className="pl-3 border-l-2 border-primary/30"
                      >
                        <p className="font-serif font-bold text-base text-foreground">
                          {ex.chinese}
                        </p>
                        <p className="text-sm text-primary">{ex.pinyin}</p>
                        <p className="text-sm text-muted-foreground italic">
                          {ex.translation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* QUIZ STEP */}
        {currentStep === "quiz" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Mini-Quiz
            </p>
            {!quizData ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">
                  Đang tạo câu hỏi...
                </p>
              </div>
            ) : quizResult ? (
              <div className="space-y-4">
                <div
                  className={cn(
                    "p-6 rounded-2xl border text-center",
                    quizResult.passed
                      ? "bg-green-50 border-green-200"
                      : "bg-orange-50 border-orange-200",
                  )}
                >
                  <p
                    className="text-4xl font-bold mb-2"
                    data-testid="text-quiz-score"
                  >
                    {quizResult.score}
                    <span className="text-lg font-normal text-muted-foreground">
                      /100
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {quizResult.correctCount}/{quizResult.totalCount} câu đúng
                  </p>
                  <p className="font-semibold mt-2 text-yellow-600">
                    +{quizResult.xpEarned} XP
                  </p>
                </div>
                <div className="space-y-2">
                  {quizResult.questionResults?.map((r: any, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border text-sm",
                        r.isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200",
                      )}
                    >
                      {r.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        {!r.isCorrect && (
                          <p className="text-xs text-muted-foreground truncate">
                            Đáp án:{" "}
                            <span className="font-semibold text-foreground">
                              {r.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full h-12 rounded-xl"
                  onClick={() => setLocation("/dashboard")}
                  data-testid="button-finish-lesson"
                >
                  Hoàn thành bài học <CheckCircle className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {quizData.questions?.map((q: any, i: number) => (
                  <div key={q.id} className="bg-card border rounded-2xl p-5">
                    <p className="font-medium text-sm mb-3">
                      {i + 1}. {q.question}
                    </p>
                    {q.type === "pinyin_input" ? (
                      <input
                        data-testid={`quiz-input-${q.id}`}
                        type="text"
                        placeholder="Nhập Pinyin..."
                        value={quizAnswers[q.id] ?? ""}
                        onChange={(e) =>
                          setQuizAnswers((a) => ({
                            ...a,
                            [q.id]: e.target.value,
                          }))
                        }
                        className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : q.options ? (
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt: string, j: number) => (
                          <button
                            key={j}
                            data-testid={`quiz-opt-${q.id}-${j}`}
                            onClick={() =>
                              setQuizAnswers((a) => ({ ...a, [q.id]: opt }))
                            }
                            className={cn(
                              "py-2.5 px-3 rounded-lg border text-sm text-left transition-all",
                              quizAnswers[q.id] === opt
                                ? "bg-primary/10 border-primary text-primary font-medium"
                                : "bg-background border-border hover:border-primary/50",
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                <Button
                  className="w-full h-12 rounded-xl"
                  onClick={handleQuizSubmit}
                  disabled={
                    submitQuiz.isPending ||
                    Object.keys(quizAnswers).length < quizData.questions.length
                  }
                  data-testid="button-submit-quiz"
                >
                  {submitQuiz.isPending ? "Đang chấm..." : "Nộp bài"}{" "}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom action bar (for steps that don't manage their own buttons) */}
      {(currentStep === "dialogue" || currentStep === "grammar") && (
        <div className="px-5 pb-6 pt-2">
          <Button
            className="w-full h-12 rounded-xl"
            onClick={handleStepComplete}
            disabled={updateProgress.isPending}
            data-testid="button-next-step"
          >
            {updateProgress.isPending
              ? "Đang lưu..."
              : currentStep === "grammar"
                ? "Tiếp tục"
                : "Hiểu rồi, tiếp theo"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
