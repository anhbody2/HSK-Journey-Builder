import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, BookOpen, BarChart2, User, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [collapsed, setCollapsed] = useState(false);
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
                /* When collapsed: logo acts as the expand toggle */
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

            {/* User + XP section */}
            <div className={cn("border-t space-y-3", collapsed ? "p-2" : "p-4")}>
              {collapsed ? (
                /* Collapsed: just avatar with XP tooltip */
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

      <main className={cn(
        "flex-1 w-full min-w-0",
        !hideNav && "pb-20 md:pb-0",
      )}>
        {children}
      </main>
    </div>
  );
}
