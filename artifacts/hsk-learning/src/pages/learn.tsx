import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLessons } from "@workspace/api-client-react";
import {
  BookOpen, Lock, CheckCircle, Brain, Mic, ChevronRight,
  Search, GraduationCap, Star, Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const HSK_META: Record<number, { name: string; words: number; color: string; bg: string; darkBg: string }> = {
  1: { name: "Sơ cấp",   words: 150,  color: "text-green-600",  bg: "bg-green-50 border-green-200",        darkBg: "dark:bg-green-950/30 dark:border-green-800" },
  2: { name: "Cơ bản",   words: 300,  color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",          darkBg: "dark:bg-blue-950/30 dark:border-blue-800" },
  3: { name: "Trung cấp",words: 600,  color: "text-purple-600", bg: "bg-purple-50 border-purple-200",      darkBg: "dark:bg-purple-950/30 dark:border-purple-800" },
  4: { name: "Cao trung", words: 1200, color: "text-orange-600", bg: "bg-orange-50 border-orange-200",     darkBg: "dark:bg-orange-950/30 dark:border-orange-800" },
  5: { name: "Cao cấp",  words: 2500, color: "text-rose-600",   bg: "bg-rose-50 border-rose-200",         darkBg: "dark:bg-rose-950/30 dark:border-rose-800" },
};

interface VocabWord {
  id: number;
  level: number;
  chinese: string;
  pinyin: string;
  meaning: string;
  exampleChinese: string;
  examplePinyin: string;
  exampleMeaning: string;
}

function FlashCard({ word }: { word: VocabWord }) {
  const [flipped, setFlipped] = useState(false);
  const meta = HSK_META[word.level];
  return (
    <div
      className="w-full cursor-pointer"
      style={{ perspective: "1000px", height: 180 }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }}
          className={cn(
            "rounded-2xl border-2 flex flex-col items-center justify-center gap-2 p-5 select-none",
            meta.bg, meta.darkBg,
          )}
        >
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", meta.color)}>
            HSK {word.level}
          </span>
          <span className="text-4xl font-bold text-foreground leading-none">{word.chinese}</span>
          <span className="text-xs text-muted-foreground mt-1">Nhấn để lật ✦</span>
        </div>

        {/* Back */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }}
          className="rounded-2xl border-2 border-border bg-card flex flex-col justify-between p-5 select-none"
        >
          <div className="space-y-1">
            <p className={cn("text-lg font-bold", meta.color)}>{word.pinyin}</p>
            <p className="font-semibold text-foreground">{word.meaning}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground font-medium">Ví dụ:</p>
            <p className="text-sm text-foreground font-medium">{word.exampleChinese}</p>
            <p className="text-xs text-muted-foreground">{word.examplePinyin}</p>
            <p className="text-xs text-muted-foreground italic">{word.exampleMeaning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlashCardSkeleton() {
  return <Skeleton className="w-full rounded-2xl" style={{ height: 180 }} />;
}

function ExamCard({
  level,
  totalLessons,
  completedLessons,
  isLoading,
  onClick,
}: {
  level: number;
  totalLessons: number;
  completedLessons: number;
  isLoading: boolean;
  onClick: () => void;
}) {
  const meta = HSK_META[level];
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isLocked = level > 1;

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        meta.bg, meta.darkBg,
        isLocked && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-black uppercase tracking-widest", meta.color)}>
              HSK {level}
            </span>
            {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
            {completedLessons === totalLessons && totalLessons > 0 && (
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
            )}
          </div>
          <p className="font-bold text-sm text-foreground">{meta.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{meta.words} từ vựng</p>
        </div>
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
          meta.color, "bg-white/60 dark:bg-white/10",
        )}>
          {completedLessons === totalLessons && totalLessons > 0
            ? <CheckCircle className="w-5 h-5" />
            : isLocked ? <Lock className="w-4 h-4" />
            : <GraduationCap className="w-5 h-5" />}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{completedLessons}/{totalLessons} bài học</span>
          <span className={cn("font-bold", meta.color)}>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", {
              "bg-green-500": level === 1,
              "bg-blue-500": level === 2,
              "bg-purple-500": level === 3,
              "bg-orange-500": level === 4,
              "bg-rose-500": level === 5,
            })}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={cn(
        "w-full py-2 rounded-xl text-xs font-bold text-center transition-colors",
        "bg-white/60 dark:bg-white/10 group-hover:bg-white/80 dark:group-hover:bg-white/20",
        meta.color,
      )}>
        {isLocked ? "🔒 Chưa mở khóa" : completedLessons === totalLessons ? "✓ Xem lại" : "Bắt đầu học →"}
      </div>
    </button>
  );
}

export default function LearnPage() {
  const [, setLocation] = useLocation();
  const [vocabLevel, setVocabLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allLessons, isLoading: lessonsLoading } = useGetLessons({});

  const { data: vocabulary, isLoading: vocabLoading } = useQuery<VocabWord[]>({
    queryKey: ["vocabulary", vocabLevel],
    queryFn: async () => {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/vocabulary?level=${vocabLevel}`);
      if (!res.ok) throw new Error("Failed to fetch vocabulary");
      return res.json();
    },
  });

  const lessonsByLevel = (allLessons ?? []).reduce<Record<number, typeof allLessons>>((acc, l) => {
    if (!acc[l.level]) acc[l.level] = [];
    acc[l.level]!.push(l);
    return acc;
  }, {});

  const filteredVocab = (vocabulary ?? []).filter(w =>
    !searchTerm ||
    w.chinese.includes(searchTerm) ||
    w.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const flashCards = filteredVocab.slice(0, 6);
  const listVocab = filteredVocab;

  return (
    <AppLayout>
      <div className="p-6 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Học tập</h1>
          <p className="text-sm text-muted-foreground mt-1">Thư viện bài thi & từ vựng theo cấp độ HSK</p>
        </div>

        {/* ── Exam Library ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-foreground">Thư viện đề thi</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((level) => {
              const levelLessons = lessonsByLevel[level] ?? [];
              const completed = levelLessons.filter(l => l.isCompleted).length;
              return (
                <ExamCard
                  key={level}
                  level={level}
                  totalLessons={lessonsLoading ? 8 : levelLessons.length}
                  completedLessons={completed}
                  isLoading={lessonsLoading}
                  onClick={() => setLocation(`/learn/${level}`)}
                />
              );
            })}
          </div>
        </section>

        {/* ── Vocabulary Section ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-foreground">Từ vựng</h2>
          </div>

          {/* Level filter + search */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((lv) => (
                <button
                  key={lv}
                  onClick={() => { setVocabLevel(lv); setSearchTerm(""); }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                    vocabLevel === lv
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  HSK {lv}
                </button>
              ))}
            </div>
            <div className="flex-1 min-w-[180px] relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm từ vựng..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left — Flip flashcards */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Thẻ ghi nhớ · nhấn để lật
              </p>
              <div className="grid grid-cols-2 gap-3">
                {vocabLoading
                  ? Array.from({ length: 4 }).map((_, i) => <FlashCardSkeleton key={i} />)
                  : flashCards.length > 0
                    ? flashCards.slice(0, 4).map(word => <FlashCard key={word.id} word={word} />)
                    : (
                      <div className="col-span-2 py-10 text-center text-muted-foreground text-sm">
                        Không tìm thấy từ vựng
                      </div>
                    )
                }
              </div>
            </div>

            {/* Right — Vocabulary list */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Danh sách · {filteredVocab.length} từ
              </p>
              <div className="space-y-1.5">
                {vocabLoading
                  ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
                  : listVocab.length > 0
                    ? listVocab.map(word => {
                        const meta = HSK_META[word.level];
                        return (
                          <div
                            key={word.id}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-default"
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg",
                              meta.bg, meta.darkBg, meta.color,
                            )}>
                              {word.chinese.length <= 2 ? word.chinese : word.chinese[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span className="font-bold text-sm text-foreground">{word.chinese}</span>
                                <span className={cn("text-xs font-medium", meta.color)}>{word.pinyin}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{word.meaning}</p>
                            </div>
                            <button
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                              title="Phát âm"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    : (
                      <div className="py-10 text-center text-muted-foreground text-sm">
                        Không tìm thấy từ vựng phù hợp
                      </div>
                    )
                }
              </div>
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
