import { AppLayout } from "@/components/layout";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetProgress,
  useGetStreak,
  useGetDashboardStats,
  getGetProgressQueryKey,
  getGetStreakQueryKey,
  getGetDashboardStatsQueryKey,
} from "@workspace/api-client-react";
import { Flame, BookOpen, Trophy, CheckCircle, BarChart2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const HSK_LEVELS = [1, 2, 3, 4, 5];
const HSK_COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-red-500",
];

export default function ProgressPage() {
  const { data: progress, isLoading: progressLoading } = useGetProgress({ query: { queryKey: getGetProgressQueryKey() } });
  const { data: streak, isLoading: streakLoading } = useGetStreak({ query: { queryKey: getGetStreakQueryKey() } });
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({ query: { queryKey: getGetDashboardStatsQueryKey() } });

  const loading = progressLoading || streakLoading || statsLoading;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold">Tiến độ học tập</h1>
          <p className="text-sm text-muted-foreground mt-1">Theo dõi hành trình chinh phục tiếng Trung</p>
        </div>

        {/* Streak + XP cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Streak</span>
            </div>
            {streakLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <p className="text-3xl font-bold" data-testid="text-current-streak">{streak?.currentStreak ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">ngày liên tiếp</p>
                <p className="text-xs text-muted-foreground mt-2">Kỷ lục: <span className="font-semibold text-foreground">{streak?.longestStreak ?? 0} ngày</span></p>
              </>
            )}
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">XP</span>
            </div>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <p className="text-3xl font-bold" data-testid="text-total-xp">{stats?.totalXp ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">điểm kinh nghiệm</p>
              </>
            )}
          </div>
        </div>

        {/* Level progress */}
        {!progressLoading && progress && (
          <div className="bg-card border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Cấp độ hiện tại</p>
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full">
                <Target className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">HSK {progress.currentLevel}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Tiến độ HSK {progress.currentLevel}</span>
                <span className="font-semibold">{progress.levelProgressPercent}%</span>
              </div>
              <Progress value={progress.levelProgressPercent} className="h-3 rounded-full" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{progress.completedLessons} bài đã hoàn thành</span>
                <span>{progress.totalLessons} bài tổng cộng</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              {progressLoading ? <Skeleton className="h-6 w-12" /> : (
                <p className="text-xl font-bold" data-testid="text-vocabulary-learned">{progress?.vocabularyLearned ?? 0}</p>
              )}
              <p className="text-xs text-muted-foreground">từ đã học</p>
            </div>
          </div>
          <div className="bg-card border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              {progressLoading ? <Skeleton className="h-6 w-12" /> : (
                <p className="text-xl font-bold" data-testid="text-completed-lessons">{progress?.completedLessons ?? 0}</p>
              )}
              <p className="text-xs text-muted-foreground">bài hoàn thành</p>
            </div>
          </div>
        </div>

        {/* Weekly XP chart */}
        {!progressLoading && progress?.weeklyXp && (
          <div className="bg-card border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-primary" />
              <p className="font-semibold text-sm">XP tuần này</p>
            </div>
            <div className="flex items-end justify-between gap-2 h-24">
              {progress.weeklyXp.map((day, i) => {
                const maxXp = Math.max(...progress.weeklyXp.map(d => d.xp), 1);
                const height = day.xp > 0 ? Math.max(12, (day.xp / maxXp) * 96) : 6;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-medium text-primary">{day.xp > 0 ? day.xp : ""}</span>
                    <div
                      data-testid={`progress-bar-${day.day}`}
                      className={cn(
                        "w-full rounded-md transition-all",
                        day.xp > 0 ? "bg-primary" : "bg-muted"
                      )}
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* HSK level map */}
        <div className="bg-card border rounded-2xl p-5">
          <p className="font-semibold text-sm mb-4">Lộ trình HSK</p>
          <div className="flex items-center gap-0">
            {HSK_LEVELS.map((l, i) => {
              const isCompleted = (progress?.currentLevel ?? 1) > l;
              const isCurrent = (progress?.currentLevel ?? 1) === l;
              return (
                <div key={l} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all",
                      isCompleted ? HSK_COLORS[i] : isCurrent ? `${HSK_COLORS[i]} ring-4 ring-offset-2 ring-primary/30` : "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : l}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">HSK {l}</p>
                  </div>
                  {i < HSK_LEVELS.length - 1 && (
                    <div className={cn(
                      "flex-1 h-1 mx-1",
                      isCompleted ? HSK_COLORS[i] : "bg-muted"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
