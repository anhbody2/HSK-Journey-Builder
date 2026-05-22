import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import { ChevronLeft, User, Target, Clock, Save } from "lucide-react";
import { useState } from "react";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const HSK_LEVELS = [1, 2, 3, 4, 5];
const GOAL_OPTIONS = [
  { value: 10, label: "10 phút" },
  { value: 15, label: "15 phút" },
  { value: 20, label: "20 phút" },
  { value: 30, label: "30 phút" },
  { value: 45, label: "45 phút" },
  { value: 60, label: "1 giờ" },
];

export default function SettingsProfilePage() {
  const { data: profile } = useGetProfile();
  const { mutate: updateProfile, isPending, isSuccess } = useUpdateProfile();

  const [name, setName] = useState(profile?.name ?? "");
  const [targetLevel, setTargetLevel] = useState(profile?.targetLevel ?? 3);
  const [dailyGoal, setDailyGoal] = useState(profile?.dailyGoalMinutes ?? 15);

  const handleSave = () => {
    updateProfile({ name: name || "Học viên", targetLevel, dailyGoalMinutes: dailyGoal });
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/settings">
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold">Hồ sơ học viên</h1>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-9 h-9 text-primary" />
          </div>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Tên hiển thị</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={profile?.name ?? "Nhập tên của bạn..."}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Target Level */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Mục tiêu HSK</p>
            </div>
            <div className="flex gap-2">
              {HSK_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setTargetLevel(level)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all",
                    targetLevel === level
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border-transparent",
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Cấp độ hiện tại: HSK {profile?.currentLevel ?? "—"}
            </p>
          </div>

          {/* Daily goal */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Mục tiêu hàng ngày</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {GOAL_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDailyGoal(opt.value)}
                  className={cn(
                    "py-2.5 rounded-xl border text-sm font-medium transition-all",
                    dailyGoal === opt.value
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border-transparent",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isPending}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all",
              isSuccess
                ? "bg-emerald-500 text-white"
                : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95",
              isPending && "opacity-60 cursor-not-allowed",
            )}
          >
            <Save className="w-4 h-4" />
            {isPending ? "Đang lưu..." : isSuccess ? "Đã lưu!" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
