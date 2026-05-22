import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import {
  Activity,
  User,
  Palette,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const SETTINGS_ITEMS = [
  {
    icon: Activity,
    label: "Hoạt động",
    desc: "Lịch sử bài học và thống kê",
    href: "/settings/activity",
    iconBg: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
  },
  {
    icon: User,
    label: "Hồ sơ học viên",
    desc: "Tên, mục tiêu HSK, thời gian học",
    href: "/settings/profile",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    icon: Palette,
    label: "Giao diện",
    desc: "Chủ đề sáng, tối hoặc theo hệ thống",
    href: "/settings/appearance",
    iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  },
  {
    icon: HelpCircle,
    label: "Trợ giúp",
    desc: "Hướng dẫn sử dụng và câu hỏi thường gặp",
    href: "/settings/help",
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    icon: MessageSquare,
    label: "Gửi phản hồi",
    desc: "Góp ý hoặc báo lỗi cho chúng tôi",
    href: "/settings/feedback",
    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
];

export default function SettingsPage() {
  const { data: stats } = useGetDashboardStats();

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Cài đặt</h1>

        {/* User card */}
        <div className="rounded-2xl border bg-card p-5 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">Học viên</p>
            <p className="text-sm text-muted-foreground">
              HSK {stats?.currentLevel ?? "—"} → HSK {stats?.targetLevel ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-foreground">{stats?.totalXp ?? 0} XP</span>
          </div>
        </div>

        {/* Settings list */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          {SETTINGS_ITEMS.map(({ icon: Icon, label, desc, href, iconBg }, i) => (
            <Link key={href} href={href}>
              <div className={cn(
                "flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors cursor-pointer",
                i < SETTINGS_ITEMS.length - 1 && "border-b",
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  iconBg,
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-8">
          HSK Smart Learning · v1.0
        </p>
      </div>
    </AppLayout>
  );
}
