import { useGetLessons, useGetDashboardStats } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  Lock,
  CheckCircle2,
  Star,
  BookOpen,
  MessageCircle,
  Volume2,
  Brain,
  ClipboardList,
  Trophy,
  ChevronRight,
} from "lucide-react";

const HSK_LEVELS = [
  {
    level: 1,
    label: "HSK 1 — Sơ cấp",
    desc: "150 từ vựng cơ bản",
    color: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    nodeBg: "bg-emerald-500",
    nodeCompleted: "bg-emerald-600",
    nodeLocked: "bg-gray-300 dark:bg-gray-700",
    accent: "#10b981",
  },
  {
    level: 2,
    label: "HSK 2 — Cơ bản",
    desc: "300 từ vựng",
    color: "from-blue-500 to-indigo-600",
    ring: "ring-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    nodeBg: "bg-blue-500",
    nodeCompleted: "bg-blue-600",
    nodeLocked: "bg-gray-300 dark:bg-gray-700",
    accent: "#3b82f6",
  },
  {
    level: 3,
    label: "HSK 3 — Trung cấp",
    desc: "600 từ vựng",
    color: "from-violet-500 to-purple-600",
    ring: "ring-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    nodeBg: "bg-violet-500",
    nodeCompleted: "bg-violet-600",
    nodeLocked: "bg-gray-300 dark:bg-gray-700",
    accent: "#8b5cf6",
  },
  {
    level: 4,
    label: "HSK 4 — Khá",
    desc: "1200 từ vựng",
    color: "from-orange-500 to-amber-600",
    ring: "ring-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    nodeBg: "bg-orange-500",
    nodeCompleted: "bg-orange-600",
    nodeLocked: "bg-gray-300 dark:bg-gray-700",
    accent: "#f97316",
  },
  {
    level: 5,
    label: "HSK 5 — Nâng cao",
    desc: "2500 từ vựng",
    color: "from-rose-500 to-pink-600",
    ring: "ring-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    nodeBg: "bg-rose-500",
    nodeCompleted: "bg-rose-600",
    nodeLocked: "bg-gray-300 dark:bg-gray-700",
    accent: "#f43f5e",
  },
];

const typeIcon: Record<string, typeof BookOpen> = {
  dialogue: MessageCircle,
  vocabulary: BookOpen,
  pinyin_basics: Volume2,
  grammar: Brain,
  review: ClipboardList,
};

const ZIGZAG = [
  "ml-8",
  "ml-24",
  "ml-40",
  "ml-24",
  "ml-8",
  "ml-0",
  "ml-16",
  "ml-32",
];

export default function RoadmapPage() {
  const { data: allLessons, isLoading } = useGetLessons({});
  const { data: stats } = useGetDashboardStats();

  const currentXp = stats?.totalXp ?? 0;

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-1">Lộ Trình Học</h1>
          <p className="text-sm text-muted-foreground">
            Chinh phục từng cấp độ HSK, từng bước một
          </p>
          {stats && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-primary">{currentXp} XP</span>
              <span className="text-xs text-muted-foreground">· HSK {stats.currentLevel} đang học</span>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-full bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {HSK_LEVELS.map((lvl) => {
          const lessons = (allLessons ?? []).filter((l) => l.level === lvl.level);
          if (lessons.length === 0 && !isLoading) return null;

          const isLevelLocked = lvl.level > (stats?.currentLevel ?? 1) + 1 ||
            (lvl.level > 1 && (allLessons ?? []).filter(l => l.level === lvl.level - 1 && !l.isCompleted).length > 0 && lvl.level > (stats?.currentLevel ?? 1));

          return (
            <div key={lvl.level} className="mb-6">
              {/* Level banner */}
              <div className={cn(
                "rounded-2xl p-4 mb-6 bg-gradient-to-r text-white shadow-md",
                lvl.color,
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-base">{lvl.label}</h2>
                    <p className="text-white/75 text-xs mt-0.5">{lvl.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isLevelLocked ? (
                      <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Chưa mở
                      </div>
                    ) : (
                      <Link href={`/learn/${lvl.level}`}>
                        <div className="bg-white/20 hover:bg-white/30 transition-colors rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1 cursor-pointer">
                          Xem tất cả <ChevronRight className="w-3 h-3" />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Lesson nodes — zigzag path */}
              <div className="relative flex flex-col gap-2">
                {/* Vertical connector line */}
                <div
                  className="absolute left-[calc(50%)] top-8 bottom-8 w-0.5 opacity-20"
                  style={{ backgroundColor: lvl.accent }}
                />

                {lessons.map((lesson, idx) => {
                  const Icon = typeIcon[lesson.type] ?? BookOpen;
                  const zigzagClass = ZIGZAG[idx % ZIGZAG.length];

                  const nodeEl = (
                    <div
                      className={cn(
                        "relative flex flex-col items-center gap-2 transition-transform duration-200",
                        !lesson.isLocked && "hover:scale-105 cursor-pointer",
                        zigzagClass,
                      )}
                    >
                      {/* Node circle */}
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center shadow-md border-4 border-white dark:border-card transition-all",
                        lesson.isCompleted
                          ? lvl.nodeCompleted
                          : lesson.isLocked
                          ? lvl.nodeLocked
                          : lvl.nodeBg,
                      )}>
                        {lesson.isCompleted ? (
                          <CheckCircle2 className="w-7 h-7 text-white" />
                        ) : lesson.isLocked ? (
                          <Lock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <Icon className="w-7 h-7 text-white" />
                        )}
                      </div>

                      {/* Star badge for completed */}
                      {lesson.isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-white dark:border-card">
                          <Star className="w-2.5 h-2.5 text-yellow-800 fill-yellow-800" />
                        </div>
                      )}

                      {/* XP badge for active (not locked, not completed) */}
                      {!lesson.isLocked && !lesson.isCompleted && (
                        <div
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-card text-white text-[9px] font-bold"
                          style={{ backgroundColor: lvl.accent }}
                        >
                          +{lesson.xpReward}
                        </div>
                      )}

                      {/* Label */}
                      <div className="text-center max-w-[110px]">
                        <p className={cn(
                          "text-[11px] font-semibold leading-tight",
                          lesson.isLocked ? "text-muted-foreground/60" : "text-foreground",
                        )}>
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {lesson.titleChinese}
                        </p>
                      </div>
                    </div>
                  );

                  return (
                    <div key={lesson.id} className="flex justify-center py-1">
                      {lesson.isLocked ? (
                        nodeEl
                      ) : (
                        <Link href={`/lesson/${lesson.id}`}>{nodeEl}</Link>
                      )}
                    </div>
                  );
                })}

                {/* Checkpoint node at the end of each level */}
                {lessons.length > 0 && !isLevelLocked && (
                  <div className="flex justify-center py-3 mt-2">
                    <Link href={`/checkpoint/${lvl.level}`}>
                      <div className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                        <div className={cn(
                          "w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-card bg-gradient-to-br",
                          lvl.color,
                        )}>
                          <Trophy className="w-9 h-9 text-white" />
                        </div>
                        <span className="text-xs font-bold text-foreground">Kiểm tra cấp {lvl.level}</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
