import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDashboardStats,
  useGetDailyTasks,
  useGetProfile,
  useGetLessons,
} from "@workspace/api-client-react";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Trophy,
  Clock,
  CheckCircle,
  Map,
  Medal,
  Settings2,
  Sparkles,
  Library,
  GraduationCap,
  ChevronRight,
  Volume2,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NEW_FEATURES = [
  {
    icon: Map,
    label: "Lộ Trình Học",
    desc: "Lộ trình Duolingo-style từ HSK 1 đến HSK 5",
    href: "/roadmap",
    badge: "Mới",
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Medal,
    label: "Bảng Xếp Hạng",
    desc: "Cạnh tranh cùng hàng nghìn học viên khác",
    href: "/leaderboard",
    badge: "Mới",
    color:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: Settings2,
    label: "Cài Đặt Nâng Cao",
    desc: "Tùy chỉnh giao diện, hồ sơ và mục tiêu học",
    href: "/settings",
    badge: "Cập nhật",
    color:
      "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    badgeColor: "bg-violet-100 text-violet-700",
  },
];

const LIBRARY_SECTIONS = [
  {
    label: "Từ vựng",
    icon: BookOpen,
    desc: "Tra cứu từ theo HSK",
    color: "bg-blue-100 text-blue-600",
    href: "/learn/1",
  },
  {
    label: "Ngữ pháp",
    icon: Brain,
    desc: "Cấu trúc & mẫu câu",
    color: "bg-purple-100 text-purple-600",
    href: "/learn/1",
  },
  {
    label: "Shadowing",
    icon: Volume2,
    desc: "Luyện phát âm",
    color: "bg-orange-100 text-orange-600",
    href: "/lesson/1",
  },
  {
    label: "Kiểm tra",
    icon: GraduationCap,
    desc: "Ôn luyện HSK",
    color: "bg-rose-100 text-rose-600",
    href: "/checkpoint/1",
  },
];

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
  const { data: daily } = useGetDailyTasks();
  const { data: lessons } = useGetLessons({});

  useEffect(() => {
    if (!profileLoading && profile && !profile.onboardingCompleted) {
      setLocation("/onboarding");
    }
  }, [profileLoading, profile, setLocation]);

  if (!profileLoading && profile && !profile.onboardingCompleted) return null;

  // Last 3 unlocked or in-progress lessons for the library recent section
  const recentLessons = (lessons ?? []).filter((l) => !l.isLocked).slice(0, 3);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header greeting */}
        <div className="flex items-center justify-between bg-red-primary border-2 border-secondary rounded-2xl px-9 py-12">
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
            <span className="text-sm font-bold">
              {stats?.currentStreak ?? 0}
            </span>
          </div>
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

        {/* ✨ New Features section (replaces HSK level progress) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm text-foreground">
              Tính năng mới
            </h2>
          </div>
          <div className="space-y-2.5">
            {NEW_FEATURES.map(
              ({ icon: Icon, label, desc, href, badge, color, badgeColor }) => (
                <Link key={href} href={href}>
                  <div className="flex items-center gap-4 p-4 bg-card border rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                        color,
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-foreground">
                          {label}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                            badgeColor,
                          )}
                        >
                          {badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {desc}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* 📚 Library section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Library className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-sm text-foreground">
                Thư viện
              </h2>
            </div>
            <Link href="/learn/1">
              <span className="text-xs text-primary font-medium hover:underline">
                Xem tất cả →
              </span>
            </Link>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {LIBRARY_SECTIONS.map(
              ({ label, icon: Icon, desc, color, href }) => (
                <Link key={label} href={href}>
                  <div className="bg-card border rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer text-center">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center",
                        color,
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
                      {desc}
                    </p>
                  </div>
                </Link>
              ),
            )}
          </div>

          {/* Recent accessible lessons */}
          {recentLessons.length > 0 && (
            <div className="bg-card border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Bài học gần đây
                </p>
              </div>
              {recentLessons.map((lesson, i) => (
                <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                      i < recentLessons.length - 1 && "border-b",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        lesson.isCompleted
                          ? "bg-green-100 text-green-600"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      {lesson.isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <BookOpen className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {lesson.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {lesson.titleChinese} · HSK {lesson.level}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span>{lesson.xpReward}</span>
                    </div>
                  </div>
                </Link>
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
