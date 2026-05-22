import { useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDashboardStats,
  useGetDailyTasks,
  useGetProfile,
  getGetDashboardStatsQueryKey,
  getGetDailyTasksQueryKey,
} from "@workspace/api-client-react";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Trophy,
  Clock,
  CheckCircle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-card border rounded-xl p-4">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
          color,
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: daily, isLoading: dailyLoading } = useGetDailyTasks();

  useEffect(() => {
    if (!profileLoading && profile && !profile.onboardingCompleted) {
      setLocation("/onboarding");
    }
  }, [profileLoading, profile, setLocation]);

  if (!profileLoading && profile && !profile.onboardingCompleted) {
    return null;
  }

  const loading = statsLoading || dailyLoading;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header greeting */}
        <div className="flex items-center justify-between bg-primary border-2 border-primary rounded-2xl px-9 py-12">
          <div>
            {profileLoading ? (
              <Skeleton className="h-8 w-48 mb-2" />
            ) : (
              <h1 className="text-2xl font-bold text-primary-foreground">
                Xin chào, {profile?.name}!
              </h1>
            )}
            <p className="text-sm text-primary-foreground/70 mt-1">
              {daily?.motivationMessage ?? "Hôm nay học một chút nhé!"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full flex-shrink-0">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span className="text-sm font-bold" data-testid="text-streak">
              {stats?.currentStreak ?? 0}
            </span>
          </div>
        </div>

        {/* Daily progress */}
        <div className="bg-card border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm">Mục tiêu hôm nay</p>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <p className="text-sm text-muted-foreground">
                {daily?.completedMinutes ?? 0} / {daily?.totalMinutes ?? 15}{" "}
                phút
              </p>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-2 w-full rounded-full" />
          ) : (
            <Progress
              value={Math.min(
                100,
                ((daily?.completedMinutes ?? 0) /
                  Math.max(daily?.totalMinutes ?? 15, 1)) *
                  100,
              )}
              className="h-2"
            />
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : (
            <>
              <StatCard
                label="Tổng XP"
                value={stats?.totalXp ?? 0}
                icon={Trophy}
                color="bg-yellow-100 text-yellow-700"
              />
              <StatCard
                label="Từ vựng đã học"
                value={stats?.vocabularyLearned ?? 0}
                icon={BookOpen}
                color="bg-primary/10 text-primary"
              />
              <StatCard
                label="Bài đã hoàn thành"
                value={stats?.completedLessons ?? 0}
                icon={CheckCircle}
                color="bg-green-100 text-green-700"
              />
              <StatCard
                label="Hôm nay"
                value={`${stats?.todayMinutes ?? 0} ph`}
                icon={Clock}
                color="bg-blue-100 text-blue-700"
              />
            </>
          )}
        </div>

        {/* Level progress */}
        {!statsLoading && stats && (
          <div className="bg-card border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">
                  Tiến độ HSK {stats.currentLevel}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mục tiêu: HSK {stats.targetLevel}
                </p>
              </div>
              <span className="text-2xl font-bold text-primary font-serif">
                {stats.levelProgressPercent}%
              </span>
            </div>
            <Progress
              value={stats.levelProgressPercent}
              className="h-3 rounded-full"
            />
            <Button
              className="w-full mt-4 rounded-xl h-11"
              onClick={() => setLocation(`/learn/${stats.currentLevel}`)}
              data-testid="button-continue-learning"
            >
              Tiếp tục học <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Daily tasks */}
        <div>
          <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Nhiệm vụ hôm nay
          </h2>
          {dailyLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {daily?.tasks?.map((task) => (
                <button
                  key={task.lessonId}
                  data-testid={`task-${task.lessonId}`}
                  onClick={() =>
                    !task.isCompleted && setLocation(`/lesson/${task.lessonId}`)
                  }
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                    task.isCompleted
                      ? "bg-green-50 border-green-200 opacity-75"
                      : "bg-card hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      task.isCompleted
                        ? "bg-green-100 text-green-600"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {task.isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <BookOpen className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium text-sm truncate",
                        task.isCompleted &&
                          "line-through text-muted-foreground",
                      )}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {task.estimatedMinutes} phút
                    </p>
                  </div>
                  {!task.isCompleted && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weekly activity */}
        {!statsLoading && stats && stats.weeklyActivity.length > 0 && (
          <div className="bg-card border rounded-2xl p-5">
            <p className="font-semibold text-sm mb-4">Hoạt động tuần này</p>
            <div className="flex items-end justify-between gap-1.5 h-20">
              {stats.weeklyActivity.map((day, i) => {
                const maxXp = Math.max(
                  ...stats.weeklyActivity.map((d) => d.xp),
                  1,
                );
                const height =
                  day.xp > 0 ? Math.max(12, (day.xp / maxXp) * 80) : 6;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 flex-1"
                  >
                    <div
                      data-testid={`bar-${day.day}`}
                      className={cn(
                        "w-full rounded-sm transition-all",
                        day.xp > 0 ? "bg-primary" : "bg-muted",
                      )}
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
