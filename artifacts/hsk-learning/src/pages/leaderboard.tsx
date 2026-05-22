import { useGetDashboardStats } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Crown, Flame, TrendingUp } from "lucide-react";

const MOCK_LEADERS = [
  { id: 1, name: "Minh Anh", xp: 4820, level: 3, streak: 42, avatar: "M" },
  { id: 2, name: "Hương Giang", xp: 3950, level: 3, streak: 28, avatar: "H" },
  { id: 3, name: "Quốc Bảo", xp: 3210, level: 2, streak: 19, avatar: "Q" },
  { id: 4, name: "Thảo Linh", xp: 2780, level: 2, streak: 15, avatar: "T" },
  { id: 5, name: "Đức Khải", xp: 2310, level: 2, streak: 11, avatar: "Đ" },
  { id: 6, name: "Phương Vy", xp: 1950, level: 1, streak: 9, avatar: "P" },
  { id: 7, name: "Ngọc Mai", xp: 1640, level: 1, streak: 7, avatar: "N" },
  { id: 8, name: "Tuấn Kiệt", xp: 1290, level: 1, streak: 5, avatar: "T" },
  { id: 9, name: "Bích Ngọc", xp: 980, level: 1, streak: 3, avatar: "B" },
];

const PODIUM_COLORS = [
  { bg: "bg-yellow-400", text: "text-yellow-900", ring: "ring-yellow-300", shadow: "shadow-yellow-200/50", crown: "text-yellow-500", label: "1" },
  { bg: "bg-slate-300", text: "text-slate-700", ring: "ring-slate-200", shadow: "shadow-slate-200/50", crown: "text-slate-400", label: "2" },
  { bg: "bg-amber-600", text: "text-amber-100", ring: "ring-amber-400", shadow: "shadow-amber-200/50", crown: "text-amber-500", label: "3" },
];

const MEDAL_ICONS: Record<number, typeof Trophy> = {
  1: Trophy,
  2: Medal,
  3: Medal,
};

function UserAvatar({
  letter,
  size = "md",
  className,
}: {
  letter: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = size === "lg" ? "w-16 h-16 text-xl" : size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-base";
  return (
    <div className={cn(
      "rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0",
      sizeClass,
      className,
    )}>
      {letter}
    </div>
  );
}

export default function LeaderboardPage() {
  const { data: stats } = useGetDashboardStats();

  const userXp = stats?.totalXp ?? 0;
  const userName = "Bạn";

  const allEntries = [
    ...MOCK_LEADERS,
    { id: 99, name: userName, xp: userXp, level: stats?.currentLevel ?? 1, streak: stats?.currentStreak ?? 0, avatar: "B", isMe: true },
  ].sort((a, b) => b.xp - a.xp);

  const userRank = allEntries.findIndex((e) => (e as { isMe?: boolean }).isMe) + 1;
  const top3 = allEntries.slice(0, 3);
  const rest = allEntries.slice(3);

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Bảng Xếp Hạng
          </h1>
          <p className="text-sm text-muted-foreground">Tuần này · Cập nhật hàng ngày</p>
        </div>

        {/* User rank banner */}
        <div className="mb-6 rounded-2xl bg-primary/5 border border-primary/20 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              B
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">Vị trí của bạn</p>
              <p className="text-xs text-muted-foreground">{userXp} XP tuần này</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-2xl font-bold text-primary">#{userRank}</span>
          </div>
        </div>

        {/* Podium */}
        <div className="mb-8 flex items-end justify-center gap-3 px-4">
          {/* 2nd */}
          {top3[1] && (
            <div className="flex flex-col items-center gap-2 flex-1">
              <UserAvatar letter={top3[1].avatar} size="md" className="ring-4 ring-slate-300 shadow-lg" />
              <p className="text-xs font-semibold text-foreground text-center truncate w-full text-center">{top3[1].name}</p>
              <p className="text-[11px] text-muted-foreground">{top3[1].xp} XP</p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-xl flex items-center justify-center py-4 h-20">
                <span className="text-2xl font-black text-slate-500">2</span>
              </div>
            </div>
          )}
          {/* 1st */}
          {top3[0] && (
            <div className="flex flex-col items-center gap-2 flex-1">
              <Crown className="w-6 h-6 text-yellow-500" />
              <UserAvatar letter={top3[0].avatar} size="lg" className="ring-4 ring-yellow-300 shadow-xl" />
              <p className="text-xs font-bold text-foreground text-center truncate w-full text-center">{top3[0].name}</p>
              <p className="text-[11px] text-yellow-600 font-semibold">{top3[0].xp} XP</p>
              <div className="w-full bg-yellow-400 rounded-t-xl flex items-center justify-center py-4 h-28">
                <span className="text-3xl font-black text-yellow-900">1</span>
              </div>
            </div>
          )}
          {/* 3rd */}
          {top3[2] && (
            <div className="flex flex-col items-center gap-2 flex-1">
              <UserAvatar letter={top3[2].avatar} size="md" className="ring-4 ring-amber-400 shadow-lg" />
              <p className="text-xs font-semibold text-foreground text-center truncate w-full text-center">{top3[2].name}</p>
              <p className="text-[11px] text-muted-foreground">{top3[2].xp} XP</p>
              <div className="w-full bg-amber-500 rounded-t-xl flex items-center justify-center py-4 h-14">
                <span className="text-2xl font-black text-amber-100">3</span>
              </div>
            </div>
          )}
        </div>

        {/* Rank list */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          {rest.map((entry, idx) => {
            const rank = idx + 4;
            const isMe = (entry as { isMe?: boolean }).isMe;

            return (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0 transition-colors",
                  isMe
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : "hover:bg-muted/40",
                )}
              >
                {/* Rank number */}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                  isMe ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}>
                  {rank}
                </div>

                {/* Avatar */}
                <UserAvatar
                  letter={entry.avatar}
                  size="sm"
                  className={isMe ? "bg-primary/20 text-primary ring-2 ring-primary/30" : ""}
                />

                {/* Name + streak */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={cn(
                      "text-sm font-semibold truncate",
                      isMe ? "text-primary" : "text-foreground",
                    )}>
                      {isMe ? "Bạn" : entry.name}
                    </p>
                    {isMe && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                        Bạn
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-[11px] text-muted-foreground">{entry.streak} ngày · HSK {entry.level}</span>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right flex-shrink-0">
                  <p className={cn(
                    "text-sm font-bold",
                    isMe ? "text-primary" : "text-foreground",
                  )}>
                    {entry.xp.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground">XP</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Bảng xếp hạng được làm mới lúc 00:00 mỗi tuần
        </p>
      </div>
    </AppLayout>
  );
}
