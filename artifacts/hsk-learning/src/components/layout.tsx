import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  BookOpen,
  BarChart2,
  User,
  Trophy,
  ChevronLeft,
  Settings,
  Map,
  Medal,
  X,
  ChevronRight,
  Activity,
  Palette,
  HelpCircle,
  MessageSquare,
  Flame,
  Gem,
  Heart,
  Zap,
  Lock,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { useTheme } from "@/hooks/use-theme";

const SETTINGS_ITEMS = [
  {
    icon: Activity,
    label: "Hoạt động",
    href: "/settings/activity",
    iconBg:
      "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
  },
  {
    icon: User,
    label: "Hồ sơ học viên",
    href: "/settings/profile",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    icon: Palette,
    label: "Giao diện",
    href: "/settings/appearance",
    iconBg:
      "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  },
  {
    icon: HelpCircle,
    label: "Trợ giúp",
    href: "/settings/help",
    iconBg:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    icon: MessageSquare,
    label: "Gửi phản hồi",
    href: "/settings/feedback",
    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
];

function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={onClose} />}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-card no-glass border-r shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Cài đặt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {SETTINGS_ITEMS.map(({ icon: Icon, label, href, iconBg }) => (
            <Link key={href} href={href} onClick={onClose}>
              <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 transition-colors cursor-pointer">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                    iconBg,
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
        <div className="px-5 py-3 border-t flex-shrink-0">
          <p className="text-[11px] text-muted-foreground text-center">
            HSK Smart Learning · v1.0
          </p>
        </div>
      </div>
    </>
  );
}

function RightPanel() {
  const { data: stats } = useGetDashboardStats();

  const streak = stats?.currentStreak ?? 0;
  const xp = stats?.totalXp ?? 0;
  const gems = stats?.vocabularyLearned ?? 0;
  const hearts = 5;
  const completedLessons = stats?.completedLessons ?? 0;
  const lessonsToLeaderboard = Math.max(0, 3 - completedLessons);

  const dailyXpGoal = 50;
  const dailyXpEarned = Math.min(
    xp % dailyXpGoal || (xp > 0 ? dailyXpGoal : 0),
    dailyXpGoal,
  );
  const dailyProgress = Math.min(100, (dailyXpEarned / dailyXpGoal) * 100);

  return (
    <aside className="hidden xl:flex flex-col w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-l bg-card">
      <div className="p-5 space-y-4">
        {/* Stats strip */}
        <div className="flex items-center justify-between px-1">
          {/* Streak */}
          <Link href="/progress">
            <button className="flex items-center gap-1.5 group">
              <div className="w-8 h-8 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-400 group-hover:scale-110 transition-transform" />
              </div>
              <span
                className={cn(
                  "text-sm font-extrabold tracking-tight",
                  streak > 0 ? "text-orange-500" : "text-muted-foreground",
                )}
              >
                {streak}
              </span>
            </button>
          </Link>

          {/* XP / Gems */}
          <Link href="/leaderboard">
            <button className="flex items-center gap-1.5 group">
              <div className="w-8 h-8 flex items-center justify-center">
                <Gem className="w-6 h-6 text-sky-500 fill-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-sky-500">
                {xp}
              </span>
            </button>
          </Link>

          {/* Vocabulary gems */}
          <Link href="/progress">
            <button className="flex items-center gap-1.5 group">
              <div className="w-8 h-8 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-yellow-500">
                {gems}
              </span>
            </button>
          </Link>

          {/* Hearts */}
          <button className="flex items-center gap-1.5 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-rose-500">
              {hearts}
            </span>
          </button>

          {/* Shop */}
          <Link href="/settings">
            <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors group">
              <ShoppingBag className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Premium / Super card */}
        <div className="rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/30 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                HSK Smart+
              </div>
              <p className="font-bold text-sm text-foreground leading-snug">
                Nâng cấp trải nghiệm học
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Không giới hạn bài học, lộ trình cá nhân hóa và luyện tập nâng
                cao!
              </p>
            </div>
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white font-bold text-xs rounded-xl transition-all hover:shadow-md active:scale-95 uppercase tracking-wider">
            Dùng thử miễn phí 1 tuần
          </button>
        </div>

        {/* Leaderboard unlock card */}
        <div className="rounded-2xl border bg-card p-4 space-y-3">
          <p className="font-bold text-sm text-foreground">
            {lessonsToLeaderboard > 0
              ? "Mở khóa bảng xếp hạng!"
              : "Bảng xếp hạng đã mở!"}
          </p>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                lessonsToLeaderboard > 0 ? "bg-muted" : "bg-yellow-100",
              )}
            >
              {lessonsToLeaderboard > 0 ? (
                <Lock className="w-6 h-6 text-muted-foreground" />
              ) : (
                <Medal className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lessonsToLeaderboard > 0
                ? `Hoàn thành thêm ${lessonsToLeaderboard} bài học để bắt đầu cạnh tranh`
                : "Bạn đang xếp hạng cùng hàng nghìn học viên khác"}
            </p>
          </div>
          <Link href="/leaderboard">
            <button className="w-full py-2 border-2 border-primary/30 text-primary font-bold text-xs rounded-xl hover:bg-primary/5 transition-colors uppercase tracking-wider">
              Xem bảng xếp hạng →
            </button>
          </Link>
        </div>

        {/* Daily quests */}
        <div className="rounded-2xl border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm text-foreground">
              Nhiệm vụ hàng ngày
            </p>
            <Link href="/progress">
              <button className="text-xs font-bold text-sky-500 hover:underline uppercase tracking-wide">
                Xem tất cả
              </button>
            </Link>
          </div>

          {/* Quest 1: Earn XP */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Kiếm {dailyXpGoal} XP hôm nay
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${dailyProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                    {dailyXpEarned} / {dailyXpGoal}
                  </span>
                  {dailyProgress >= 100 && (
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quest 2: Complete a lesson */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Hoàn thành 1 bài học
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: completedLessons > 0 ? "100%" : "0%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                    {completedLessons > 0 ? "1 / 1" : "0 / 1"}
                  </span>
                  {completedLessons > 0 && (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Link href="/learn/1">
            <button className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary font-semibold text-xs transition-colors">
              Bắt đầu học <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>s
    </aside>
  );
}

export function AppLayout({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useTheme();
  const { data: stats } = useGetDashboardStats();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Trang chủ" },
    { href: "/roadmap", icon: Map, label: "Lộ Trình" },
    { href: "/learn", icon: BookOpen, label: "Học tập" },
    { href: "/progress", icon: BarChart2, label: "Tiến độ" },
    { href: "/leaderboard", icon: Medal, label: "Xếp hạng" },
    { href: "/add-lesson", icon: BookOpen, label: "Thêm bài học" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {!hideNav && (
        <>
          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-30 px-4 py-2 flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = location.startsWith(
                item.href.split("/")[1]
                  ? `/${item.href.split("/")[1]}`
                  : item.href,
              );
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <div
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground group-hover:bg-muted",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "text-[9px] font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex flex-col items-center gap-0.5 group"
            >
              <div className="p-2 rounded-full text-muted-foreground group-hover:bg-muted transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-medium text-muted-foreground">
                Cài đặt
              </span>
            </button>
          </nav>

          {/* Desktop Left Sidebar */}
          <aside
            className={cn(
              "hidden md:flex flex-col border-r bg-card h-screen sticky top-0 transition-all duration-300 ease-in-out flex-shrink-0",
              collapsed ? "w-16" : "w-64",
            )}
          >
            {/* Logo + toggle */}
            <div
              className={cn(
                "flex items-center border-b h-16 flex-shrink-0",
                collapsed ? "justify-center px-0" : "justify-between px-5",
              )}
            >
              {collapsed ? (
                <button
                  onClick={() => setCollapsed(false)}
                  title="Mở rộng"
                  className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl hover:opacity-80 transition-opacity"
                >
                  汉
                </button>
              ) : (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl flex-shrink-0">
                      汉
                    </div>
                    <span className="font-bold text-lg tracking-tight whitespace-nowrap">
                      HSK Smart
                    </span>
                  </Link>
                  <button
                    onClick={() => setCollapsed(true)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Nav items */}
            <nav
              className={cn(
                "flex-1 py-4 flex flex-col gap-1",
                collapsed ? "px-2" : "px-3",
              )}
            >
              {navItems.map((item) => {
                const isActive = location.startsWith(
                  item.href.split("/")[1]
                    ? `/${item.href.split("/")[1]}`
                    : item.href,
                );
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center rounded-md transition-colors font-medium text-sm",
                      collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Settings button */}
            <div className={cn("border-t", collapsed ? "p-2" : "px-3 py-3")}>
              <button
                onClick={() => setSettingsOpen(true)}
                title={collapsed ? "Cài đặt" : undefined}
                className={cn(
                  "w-full flex items-center rounded-md transition-colors font-medium text-sm",
                  location.startsWith("/settings")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                )}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!collapsed && "Cài đặt"}
              </button>
            </div>

            {/* User + XP section */}
            <div
              className={cn("border-t space-y-3", collapsed ? "p-2" : "p-4")}
            >
              {collapsed ? (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"
                    title="Học viên"
                  >
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate">Học viên</p>
                      <p className="text-xs text-muted-foreground">
                        HSK {stats?.currentLevel ?? "—"} → HSK{" "}
                        {stats?.targetLevel ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-xs font-semibold text-foreground">
                          {stats?.totalXp ?? 0} XP
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-primary">
                        {stats?.levelProgressPercent ?? 0}%
                      </span>
                    </div>
                    <Progress
                      value={stats?.levelProgressPercent ?? 0}
                      className="h-1.5"
                    />
                    <p className="text-[10px] text-muted-foreground text-center">
                      Tiến độ HSK {stats?.currentLevel ?? "—"} · Mục tiêu HSK{" "}
                      {stats?.targetLevel ?? "—"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <main
        className={cn("flex-1 w-full min-w-0", !hideNav && "pb-20 md:pb-0")}
      >
        {children}
      </main>

      {/* Right panel — Duolingo-style, desktop only */}
      {!hideNav && <RightPanel />}
    </div>
  );
}
