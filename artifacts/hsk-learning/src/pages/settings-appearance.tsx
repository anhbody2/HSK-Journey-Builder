import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import { ChevronLeft, Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/hooks/use-theme";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string; desc: string }[] = [
  { value: "light", icon: Sun, label: "Sáng", desc: "Giao diện nền trắng, phù hợp ban ngày" },
  { value: "dark", icon: Moon, label: "Tối", desc: "Giao diện tối, dễ nhìn ban đêm" },
  { value: "system", icon: Monitor, label: "Theo hệ thống", desc: "Tự động theo cài đặt thiết bị" },
];

export default function SettingsAppearancePage() {
  const { theme, setTheme } = useTheme();

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/settings">
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold">Giao diện</h1>
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden">
          {OPTIONS.map(({ value, icon: Icon, label, desc }, i) => {
            const active = theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors",
                  i < OPTIONS.length - 1 && "border-b",
                  active ? "bg-primary/5" : "hover:bg-muted/50",
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={cn("font-semibold text-sm", active ? "text-primary" : "text-foreground")}>
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                {active && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Thay đổi giao diện sẽ được lưu tự động
        </p>
      </div>
    </AppLayout>
  );
}
