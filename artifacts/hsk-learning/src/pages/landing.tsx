import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Star, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl">
            汉
          </div>
          <span className="font-bold text-lg tracking-tight">HSK Smart Learning</span>
        </div>
        <div className="flex gap-4">
          <Link href="/onboarding">
            <Button variant="ghost" className="font-medium">Đăng nhập</Button>
          </Link>
          <Link href="/onboarding">
            <Button className="font-medium">Bắt đầu ngay</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center justify-center px-3 py-1 mb-8 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          <Star className="w-4 h-4 mr-2 fill-primary" />
          Chương trình HSK 3.0 Mới Nhất
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
          Chinh phục tiếng Trung với <br className="hidden md:block" />
          <span className="text-primary font-serif italic">Gia sư cá nhân của bạn</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl text-balance leading-relaxed">
          Ứng dụng học tiếng Trung dành riêng cho người Việt. Lộ trình cá nhân hóa, luyện phát âm AI, và theo dõi tiến độ chi tiết từ HSK 1 đến HSK 5.
        </p>
        
        <Link href="/onboarding">
          <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            Bắt đầu bài kiểm tra năng lực <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lộ trình chuẩn HSK</h3>
            <p className="text-muted-foreground">Các bài học được thiết kế chặt chẽ theo cấu trúc HSK 3.0 mới nhất, giúp bạn tự tin thi đạt chứng chỉ.</p>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Luyện nói AI (Shadowing)</h3>
            <p className="text-muted-foreground">Phân tích phát âm từng âm tiết bằng AI. Phản hồi trực quan giúp bạn nói chuẩn giọng bản xứ nhanh chóng.</p>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Học tập mỗi ngày</h3>
            <p className="text-muted-foreground">Hệ thống nhiệm vụ hàng ngày được tối ưu hóa để xây dựng thói quen, không gây áp lực nhưng cực kỳ hiệu quả.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
