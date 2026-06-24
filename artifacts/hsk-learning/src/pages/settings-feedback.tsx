import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import {
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Lightbulb,
  Star,
  Send,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FeedbackType = "like" | "dislike" | "bug" | "idea" | null;

const TYPES: {
  value: FeedbackType;
  icon: typeof Star;
  label: string;
  color: string;
}[] = [
  {
    value: "like",
    icon: ThumbsUp,
    label: "Thích",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    value: "dislike",
    icon: ThumbsDown,
    label: "Không thích",
    color: "text-red-500 bg-red-50 border-red-200",
  },
  {
    value: "bug",
    icon: Bug,
    label: "Báo lỗi",
    color: "text-orange-500 bg-orange-50 border-orange-200",
  },
  {
    value: "idea",
    icon: Lightbulb,
    label: "Góp ý",
    color: "text-blue-500 bg-blue-50 border-blue-200",
  },
];

const STAR_LABELS = ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

export default function SettingsFeedbackPage() {
  const [type, setType] = useState<FeedbackType>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!type && !message) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <ThumbsUp className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Cảm ơn bạn!</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Phản hồi của bạn giúp chúng tôi cải thiện HSK Smart tốt hơn mỗi
            ngày.
          </p>
          <Link href="/settings">
            <button className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
              Quay lại cài đặt
            </button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/settings">
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold">Gửi phản hồi</h1>
        </div>

        <div className="space-y-5">
          {/* Feedback type */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <p className="text-sm font-semibold">Loại phản hồi</p>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(({ value, icon: Icon, label, color }) => (
                <button
                  key={value}
                  onClick={() => setType(value)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                    type === value
                      ? color
                      : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Star rating */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 ">
            <p className="text-sm font-semibold">Đánh giá trải nghiệm</p>
            <div className="flex items-center gap-2 justify-center ">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 duration-150 ease-in-out"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted",
                    )}
                  />
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                {STAR_LABELS[hoverRating || rating]}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <p className="text-sm font-semibold">Chi tiết (tùy chọn)</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mô tả chi tiết vấn đề hoặc góp ý của bạn..."
              rows={4}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!type && !message && !rating}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all",
              type || message || rating
                ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            <Send className="w-4 h-4" />
            Gửi phản hồi
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
