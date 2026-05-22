import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import { ChevronLeft, BookOpen, Clock, Trophy, Flame, Calendar } from "lucide-react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const RECENT_LESSONS = [
  { id: 1, title: "Âm tiết và Pinyin", chinese: "拼音入门", time: "Hôm nay, 09:15", xp: 30, completed: true },
  { id: 2, title: "Chào hỏi cơ bản", chinese: "你好！", time: "Hôm qua, 20:40", xp: 50, completed: true },
  { id: 3, title: "Số đếm 1-10", chinese: "数字一到十", time: "2 ngày trước", xp: 50, completed: true },
  { id: 4, title: "Gia đình", chinese: "我的家人", time: "3 ngày trước", xp: 60, completed: false },
];

export default function SettingsActivityPage() {
  const { data: stats } = useGetDashboardStats();

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/settings">
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold">Hoạt động</h1>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Flame, label: "Chuỗi ngày", value: `${stats?.currentStreak ?? 0}`, unit: "ngày", color: "text-orange-500 bg-orange-50" },
            { icon: Trophy, label: "Tổng XP", value: `${stats?.totalXp ?? 0}`, unit: "XP", color: "text-yellow-500 bg-yellow-50" },
            { icon: BookOpen, label: "Bài đã học", value: `${stats?.completedLessons ?? 0}`, unit: "bài", color: "text-blue-500 bg-blue-50" },
          ].map(({ icon: Icon, label, value, unit, color }) => (
            <div key={label} className="rounded-xl border bg-card p-3 flex flex-col items-center gap-1.5">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color)}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold leading-none">{value}</p>
              <p className="text-[10px] text-muted-foreground text-center">{unit}<br />{label}</p>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div className="rounded-2xl border bg-card p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Hoạt động 7 ngày qua</h2>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {(stats?.weeklyActivity ?? Array.from({ length: 7 }, (_, i) => ({ day: ["CN","T2","T3","T4","T5","T6","T7"][i], xp: 0 }))).map((day, i) => {
              const max = Math.max(...(stats?.weeklyActivity ?? []).map((d: { xp: number }) => d.xp), 1);
              const height = Math.max(4, Math.round(((day as { xp: number }).xp / max) * 64));
              const isToday = i === 6;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn("w-full rounded-t-sm transition-all", isToday ? "bg-primary" : "bg-muted")}
                    style={{ height }}
                  />
                  <p className={cn("text-[9px]", isToday ? "text-primary font-bold" : "text-muted-foreground")}>
                    {(day as { day: string }).day}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent lessons */}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Lịch sử bài học
        </h2>
        <div className="rounded-2xl border bg-card overflow-hidden">
          {RECENT_LESSONS.map((lesson, i) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer",
                i < RECENT_LESSONS.length - 1 && "border-b",
              )}>
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  lesson.completed ? "bg-primary/10" : "bg-muted",
                )}>
                  <BookOpen className={cn("w-4 h-4", lesson.completed ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{lesson.title}</p>
                  <p className="text-[11px] text-muted-foreground">{lesson.chinese} · {lesson.time}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600 flex-shrink-0">
                  <Trophy className="w-3.5 h-3.5" />
                  +{lesson.xp}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href="/progress">
            <button className="text-sm text-primary font-medium hover:underline">
              Xem đầy đủ tiến độ →
            </button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
