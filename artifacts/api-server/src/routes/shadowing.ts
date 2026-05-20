import { Router } from "express";
import { ScoreShadowingBody } from "@workspace/api-zod";

const router = Router();

router.post("/shadowing/score", async (req, res) => {
  try {
    const body = ScoreShadowingBody.parse(req.body);
    const syllables = body.targetPinyin.split(" ").filter(Boolean);

    const syllableFeedback = syllables.map((pinyin, i) => {
      const rand = Math.random();
      const chineseChars = body.targetText.split("");
      const syllable = chineseChars[i] ?? pinyin;
      let color: "green" | "yellow" | "red";
      let score: number;
      let errorType: string | null = null;

      if (rand > 0.6) {
        color = "green";
        score = 85 + Math.floor(Math.random() * 15);
      } else if (rand > 0.3) {
        color = "yellow";
        score = 60 + Math.floor(Math.random() * 25);
        errorType = "Thanh điệu chưa đúng";
      } else {
        color = "red";
        score = 30 + Math.floor(Math.random() * 30);
        errorType = "Phát âm cần cải thiện";
      }

      return { syllable, pinyin, score, color, errorType };
    });

    const overallScore = Math.round(
      syllableFeedback.reduce((sum, s) => sum + s.score, 0) / Math.max(syllableFeedback.length, 1)
    );

    const tips: string[] = [];
    const yellowOrRed = syllableFeedback.filter(s => s.color !== "green");
    if (yellowOrRed.length > 0) {
      tips.push(`Chú ý phát âm: ${yellowOrRed.map(s => s.pinyin).join(", ")}`);
    }
    if (overallScore < 60) {
      tips.push("Hãy lắng nghe âm thanh mẫu và thử lại");
    } else if (overallScore >= 80) {
      tips.push("Rất tốt! Tiếp tục luyện tập để hoàn thiện hơn");
    }

    res.json({
      overallScore,
      syllableFeedback,
      tips,
      passed: overallScore >= 60,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to score shadowing");
    res.status(400).json({ error: "Invalid request" });
  }
});

export default router;
