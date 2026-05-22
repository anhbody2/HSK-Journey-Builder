import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, BookOpen, Mic, BarChart2, Award, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQ = [
  {
    icon: BookOpen,
    q: "HSK là gì?",
    a: "HSK (汉语水平考试) là kỳ thi đánh giá năng lực tiếng Trung quốc tế dành cho người không phải bản ngữ. Có 6 cấp độ, từ HSK 1 (sơ cấp) đến HSK 6 (thành thạo). HSK Smart tập trung vào HSK 1-5.",
  },
  {
    icon: Mic,
    q: "Shadowing là gì và tại sao quan trọng?",
    a: "Shadowing là phương pháp luyện phát âm bằng cách nghe và nhắc lại đồng thời. Phương pháp này giúp cải thiện phát âm, nhịp điệu và ngữ điệu tiếng Trung nhanh hơn so với học thông thường.",
  },
  {
    icon: BarChart2,
    q: "XP là gì? Cách tích lũy XP?",
    a: "XP (Experience Points) là điểm kinh nghiệm bạn nhận được khi hoàn thành bài học. Hoàn thành quiz cuối bài = +50 XP. XP dùng để mở khóa bài học mới và xác định vị trí bảng xếp hạng.",
  },
  {
    icon: Award,
    q: "Làm sao để mở khóa bài học?",
    a: "Bài học mở khóa theo thứ tự. Hoàn thành bài trước (qua quiz) sẽ tự động mở khóa bài tiếp theo. Mỗi cấp độ HSK cần hoàn thành toàn bộ bài ở cấp trước.",
  },
  {
    icon: AlertCircle,
    q: "Tôi bị mất dữ liệu, phải làm sao?",
    a: "Dữ liệu học tập của bạn được lưu trên máy chủ. Nếu gặp sự cố, hãy thử tải lại trang. Nếu vấn đề vẫn tiếp diễn, vui lòng gửi phản hồi qua mục 'Gửi phản hồi'.",
  },
];

export default function SettingsHelpPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/settings">
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold">Trợ giúp</h1>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { label: "Hướng dẫn bắt đầu", icon: BookOpen, href: "/onboarding" },
            { label: "Xem lộ trình học", icon: BarChart2, href: "/roadmap" },
          ].map(({ label, icon: Icon, href }) => (
            <Link key={href} href={href}>
              <div className="rounded-2xl border bg-card p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-medium text-foreground">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* FAQ accordion */}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Câu hỏi thường gặp
        </h2>
        <div className="rounded-2xl border bg-card overflow-hidden">
          {FAQ.map(({ icon: Icon, q, a }, i) => (
            <div key={i} className={cn(i < FAQ.length - 1 && "border-b")}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{q}</span>
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0",
                  open === i && "rotate-90",
                )} />
              </button>
              {open === i && (
                <div className="px-5 pb-4 pt-0">
                  <div className="ml-11 text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-3">
                    {a}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-5 text-center space-y-2">
          <p className="text-sm font-medium text-foreground">Không tìm thấy câu trả lời?</p>
          <p className="text-xs text-muted-foreground">Gửi câu hỏi của bạn qua mục phản hồi</p>
          <Link href="/settings/feedback">
            <button className="mt-2 text-sm text-primary font-semibold hover:underline">
              Gửi phản hồi →
            </button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
