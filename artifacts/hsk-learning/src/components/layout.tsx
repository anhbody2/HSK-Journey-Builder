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
    iconBg: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
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
    iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  },
  {
    icon: HelpCircle,
    label: "Trợ giúp",
    href: "/settings/help",
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    icon: MessageSquare,
    label: "Gửi phản hồi",
    href: "/settings/feedback",
    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
];

function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={onClose} />}
      <div className={cn(
        "fixed left-0 top-0 h-screen w-72 bg-card border-r shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
      )}>
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

        {/* Settings list */}
        <div className="flex-1 overflow-y-auto py-2">
          {SETTINGS_ITEMS.map(({ icon: Icon, label, href, iconBg }) => (
            <Link key={href} href={href} onClick={onClose}>
              <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 transition-colors cursor-pointer">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  iconBg,
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
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
  useTheme(); // apply saved theme on mount
  const { data: stats } = useGetDashboardStats();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Trang chủ" },
    { href: "/roadmap", icon: Map, label: "Lộ Trình" },
    { href: "/learn/1", icon: BookOpen, label: "Học tập" },
    { href: "/progress", icon: BarChart2, label: "Tiến độ" },
    { href: "/leaderboard", icon: Medal, label: "Xếp hạng" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {!hideNav && (
        <>
          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-30 px-4 py-2 flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = location.startsWith(
                item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href,
              );
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 group">
                  <div className={cn(
                    "p-2 rounded-full transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:bg-muted",
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-[9px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
            <button onClick={() => setSettingsOpen(true)} className="flex flex-col items-center gap-0.5 group">
              <div className="p-2 rounded-full text-muted-foreground group-hover:bg-muted transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-medium text-muted-foreground">Cài đặt</span>
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
                  <div title={`${stats?.totalXp ?? 0} XP`}>
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
