import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, BookOpen, BarChart2, User, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useGetDashboardStats } from "@workspace/api-client-react";

export function AppLayout({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  const [location] = useLocation();
  const { data: stats } = useGetDashboardStats();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Trang chủ" },
    { href: "/learn/1", icon: BookOpen, label: "Học tập" },
    { href: "/progress", icon: BarChart2, label: "Tiến độ" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {!hideNav && (
        <>
          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50 px-6 py-3 flex justify-between items-center">
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
                  className="flex flex-col items-center gap-1 group"
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
                      "text-[10px] font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
            <div className="p-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl">
                  汉
                </div>
                <span className="font-bold text-lg tracking-tight">
                  HSK Smart
                </span>
              </Link>
            </div>

            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
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
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium text-sm",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User + XP section */}
            <div className="p-4 border-t space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate">Học viên</p>
                  <p className="text-xs text-muted-foreground">
                    HSK {stats?.currentLevel ?? "—"}
                  </p>
                </div>
              </div>

              {/* XP + level progress */}
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
            </div>
          </aside>
        </>
      )}

      <main
        className={cn(
          "flex-1 w-full max-w-5xl mx-auto",
          !hideNav && "pb-20 md:pb-0",
        )}
      >
        {children}
      </main>
    </div>
  );
}
