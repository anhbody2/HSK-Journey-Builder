import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  BookOpen,
  BarChart2,
  User,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sun,
  Moon,
  History,
  HelpCircle,
  MessageSquare,
  X,
  Check,
  ExternalLink,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useGetDashboardStats } from "@workspace/api-client-react";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  root.classList.toggle("dark", resolved === "dark");
}

function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("hsk-theme") as Theme) ?? "light";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("hsk-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return { theme, setTheme: setThemeState };
}

const HISTORY_MOCK = [
  { label: "Bài 1: Xin chào", href: "/lesson/1", time: "Hôm nay" },
  { label: "Bài 2: Gia đình", href: "/lesson/2", time: "Hôm qua" },
  { label: "Bài 3: Số đếm", href: "/lesson/3", time: "2 ngày trước" },
];

function SettingsPanel({
  open,
  onClose,
  theme,
  setTheme,
}: {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}) {
  const themeOptions: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Sáng" },
    { value: "dark", icon: Moon, label: "Tối" },
    { value: "system", icon: Monitor, label: "Hệ thống" },
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-card border-r shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
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

        <div className="flex-1 overflow-y-auto">
          {/* Theme */}
          <section className="px-4 py-4 border-b">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Giao diện
            </p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, icon: Icon, label }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-lg border transition-all text-xs font-medium",
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {active && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* History */}
          <section className="px-4 py-4 border-b">
            <div className="flex items-center gap-2 mb-3 px-1">
              <History className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Lịch sử học
              </p>
            </div>
            <div className="flex flex-col gap-1">
              {HISTORY_MOCK.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{item.time}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </section>

          {/* Help */}
          <section className="px-4 py-4 border-b">
            <div className="flex items-center gap-2 mb-3 px-1">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Trợ giúp
              </p>
            </div>
            <div className="flex flex-col gap-1">
              {[
                { label: "Hướng dẫn sử dụng", desc: "Cách học hiệu quả với HSK Smart" },
                { label: "HSK là gì?", desc: "Giới thiệu về các cấp độ HSK" },
                { label: "Phương pháp shadowing", desc: "Luyện phát âm tiếng Trung" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Feedback */}
          <section className="px-4 py-4">
            <div className="flex items-center gap-2 mb-3 px-1">
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Phản hồi
              </p>
            </div>
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bạn có góp ý hoặc phát hiện lỗi? Hãy cho chúng tôi biết để cải thiện ứng dụng.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 text-xs font-medium py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                  👍 Thích
                </button>
                <button className="flex-1 text-xs font-medium py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
                  🐛 Báo lỗi
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex-shrink-0">
          <p className="text-[11px] text-muted-foreground text-center">
            HSK Smart Learning · v1.0
          </p>
        </div>
      </div>
    </>
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
  const { theme, setTheme } = useTheme();
  const { data: stats } = useGetDashboardStats();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Trang chủ" },
    { href: "/learn/1", icon: BookOpen, label: "Học tập" },
    { href: "/progress", icon: BarChart2, label: "Tiến độ" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />

      {!hideNav && (
        <>
          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-30 px-6 py-3 flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = location.startsWith(
                item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href,
              );
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 group">
                  <div className={cn(
                    "p-2 rounded-full transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:bg-muted",
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="p-2 rounded-full text-muted-foreground group-hover:bg-muted transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">Cài đặt</span>
            </button>
          </nav>

          {/* Desktop Sidebar */}
          <aside className={cn(
            "hidden md:flex flex-col border-r bg-card h-screen sticky top-0 transition-all duration-300 ease-in-out flex-shrink-0",
            collapsed ? "w-16" : "w-64",
          )}>
            {/* Logo + toggle */}
            <div className={cn(
              "flex items-center border-b h-16 flex-shrink-0",
              collapsed ? "justify-center px-0" : "justify-between px-5",
            )}>
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
                    <span className="font-bold text-lg tracking-tight whitespace-nowrap">HSK Smart</span>
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
            <nav className={cn("flex-1 py-4 flex flex-col gap-1", collapsed ? "px-2" : "px-3")}>
              {navItems.map((item) => {
                const isActive = location.startsWith(
                  item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href,
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
                  "w-full flex items-center rounded-md transition-colors font-medium text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                )}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!collapsed && "Cài đặt"}
              </button>
            </div>

            {/* User + XP section */}
            <div className={cn("border-t space-y-3", collapsed ? "p-2" : "p-4")}>
              {collapsed ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center" title="Học viên">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="w-full bg-primary/10 rounded-full overflow-hidden h-1.5" title={`${stats?.levelProgressPercent ?? 0}%`}>
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${stats?.levelProgressPercent ?? 0}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1" title={`${stats?.totalXp ?? 0} XP`}>
                    <Trophy className="w-3.5 h-3.5 text-yellow-500" />
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
                        HSK {stats?.currentLevel ?? "—"} → HSK {stats?.targetLevel ?? "—"}
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
                    <Progress value={stats?.levelProgressPercent ?? 0} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground text-center">
                      Tiến độ HSK {stats?.currentLevel ?? "—"} · Mục tiêu HSK {stats?.targetLevel ?? "—"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      <main className={cn("flex-1 w-full min-w-0", !hideNav && "pb-20 md:pb-0")}>
        {children}
      </main>
    </div>
  );
}
