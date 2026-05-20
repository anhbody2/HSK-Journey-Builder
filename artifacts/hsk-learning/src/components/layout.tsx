import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, BookOpen, BarChart2, User, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const [location] = useLocation();

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
              const isActive = location.startsWith(item.href.split('/')[1] ? `/${item.href.split('/')[1]}` : item.href);
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 group">
                  <div className={cn(
                    "p-2 rounded-full transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:bg-muted"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>{item.label}</span>
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
                <span className="font-bold text-lg tracking-tight">HSK Smart</span>
              </Link>
            </div>
            
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.startsWith(item.href.split('/')[1] ? `/${item.href.split('/')[1]}` : item.href);
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium text-sm",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">Học viên</p>
                  <p className="text-xs text-muted-foreground truncate">Mục tiêu HSK 3</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      <main className={cn(
        "flex-1 w-full max-w-5xl mx-auto",
        !hideNav && "pb-20 md:pb-0" // Space for mobile nav
      )}>
        {children}
      </main>
    </div>
  );
}
