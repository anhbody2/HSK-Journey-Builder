import { useRoute, useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLessons, getGetLessonsQueryKey } from "@workspace/api-client-react";
import { ArrowRight, Lock, CheckCircle, BookOpen, Mic, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, React.ElementType> = {
  pinyin_basics: Brain,
  dialogue: BookOpen,
  vocabulary: BookOpen,
  grammar: Brain,
  review: CheckCircle,
};

const TYPE_LABELS: Record<string, string> = {
  pinyin_basics: "Nhập môn Pinyin",
  dialogue: "Hội thoại",
  vocabulary: "Từ vựng",
  grammar: "Ngữ pháp",
  review: "Ôn tập",
};

const HSK_NAMES: Record<number, string> = {
  1: "Sơ cấp 1",
  2: "Sơ cấp 2",
  3: "Trung cấp",
  4: "Cao trung",
  5: "Cao cấp",
};

export default function LearnLevelPage() {
  const [match, params] = useRoute("/learn/:level");
  const [, setLocation] = useLocation();
  const level = parseInt(params?.level ?? "1");

  const { data: lessons, isLoading } = useGetLessons(
    { level },
    { query: { queryKey: getGetLessonsQueryKey({ level }) } }
  );

  const lessonsByUnit: Record<number, typeof lessons> = {};
  if (lessons) {
    for (const lesson of lessons) {
      if (!lessonsByUnit[lesson.unit]) lessonsByUnit[lesson.unit] = [];
      lessonsByUnit[lesson.unit]!.push(lesson);
    }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold font-serif text-sm flex items-center justify-center">
              {level}
            </div>
            <h1 className="text-xl font-bold">HSK {level} — {HSK_NAMES[level] ?? ""}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Đang tải..." : `${lessons?.filter(l => l.isCompleted).length ?? 0} / ${lessons?.length ?? 0} bài đã hoàn thành`}
          </p>
        </div>

        {/* Checkpoint button */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => setLocation(`/checkpoint/${level}`)}
          data-testid="button-checkpoint"
        >
          Thi kiểm tra chuẩn HSK {level} <ArrowRight className="ml-2 w-4 h-4" />
        </Button>

        {/* Lessons by unit */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, j) => <Skeleton key={j} className="h-16 rounded-xl" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(lessonsByUnit).map(([unitStr, unitLessons]) => {
              const unit = parseInt(unitStr);
              return (
                <div key={unit}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    Chủ đề {unit}
                  </p>
                  <div className="space-y-2">
                    {unitLessons?.map((lesson) => {
                      const Icon = TYPE_ICONS[lesson.type] ?? BookOpen;
                      return (
                        <button
                          key={lesson.id}
                          data-testid={`lesson-${lesson.id}`}
                          onClick={() => !lesson.isLocked && setLocation(`/lesson/${lesson.id}`)}
                          disabled={lesson.isLocked}
                          className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                            lesson.isCompleted
                              ? "bg-green-50 border-green-200"
                              : lesson.isLocked
                                ? "bg-muted/50 border-muted opacity-60 cursor-not-allowed"
                                : "bg-card border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                          )}
                        >
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                            lesson.isCompleted ? "bg-green-100 text-green-600"
                              : lesson.isLocked ? "bg-muted text-muted-foreground"
                                : "bg-primary/10 text-primary"
                          )}>
                            {lesson.isCompleted ? <CheckCircle className="w-5 h-5" />
                              : lesson.isLocked ? <Lock className="w-5 h-5" />
                                : <Icon className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{lesson.title}</p>
                              {lesson.type === "pinyin_basics" && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">BẮT BUỘC</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground">{TYPE_LABELS[lesson.type] ?? lesson.type}</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">{lesson.estimatedMinutes} phút</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs font-medium text-yellow-600">+{lesson.xpReward} XP</span>
                            </div>
                          </div>
                          {!lesson.isLocked && !lesson.isCompleted && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {(!lessons || lessons.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Chưa có bài học</p>
                <p className="text-sm mt-1">Vui lòng quay lại sau.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
