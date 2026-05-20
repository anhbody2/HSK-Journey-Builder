import { Router } from "express";
import { db, lessonsTable, quizzesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { GenerateQuizBody, SubmitQuizBody } from "@workspace/api-zod";

const router = Router();

function buildQuestionsFromLesson(vocab: any[], level: number) {
  const questions: any[] = [];
  let qId = 1;

  vocab.slice(0, 5).forEach((v: any) => {
    const type = qId % 3 === 0 ? "translation_choice" : qId % 2 === 0 ? "pinyin_input" : "matching";
    const options = type === "translation_choice"
      ? [v.translation, "chào hỏi", "tạm biệt", "cảm ơn"].sort(() => Math.random() - 0.5)
      : null;
    questions.push({
      id: qId++,
      type,
      question: type === "pinyin_input"
        ? `Nhập Pinyin cho: ${v.chinese}`
        : type === "translation_choice"
          ? `"${v.chinese}" có nghĩa là gì?`
          : `Nối từ: ${v.chinese}`,
      options,
      correctAnswer: type === "pinyin_input" ? v.pinyin : v.translation,
      audioText: null,
    });
  });

  if (questions.length === 0) {
    questions.push({
      id: 1,
      type: "translation_choice",
      question: 'Từ "你好" (nǐ hǎo) có nghĩa là gì?',
      options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
      correctAnswer: "Xin chào",
      audioText: null,
    });
  }
  return questions;
}

router.post("/quiz/generate", async (req, res) => {
  try {
    const body = GenerateQuizBody.parse(req.body);
    const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, body.lessonId)).limit(1);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const vocab = lesson.vocabulary as any[];
    const questions = buildQuestionsFromLesson(vocab, lesson.level);

    const [quiz] = await db.insert(quizzesTable).values({
      lessonId: lesson.id,
      level: lesson.level,
      type: "mini_quiz",
      questions,
      totalQuestions: questions.length,
      timeLimit: null,
    }).returning();

    res.json({
      id: quiz.id,
      lessonId: quiz.lessonId,
      level: quiz.level,
      type: quiz.type,
      questions: quiz.questions,
      totalQuestions: quiz.totalQuestions,
      timeLimit: quiz.timeLimit,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to generate quiz");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.post("/quiz/submit", async (req, res) => {
  try {
    const body = SubmitQuizBody.parse(req.body);
    const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, body.quizId)).limit(1);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const questions = quiz.questions as any[];
    const questionResults = body.answers.map(answer => {
      const q = questions.find((q: any) => q.id === answer.questionId);
      const isCorrect = q
        ? answer.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
        : false;
      return {
        questionId: answer.questionId,
        isCorrect,
        correctAnswer: q?.correctAnswer ?? "",
        userAnswer: answer.answer,
      };
    });

    const correctCount = questionResults.filter(r => r.isCorrect).length;
    const totalCount = questions.length;
    const score = Math.round((correctCount / Math.max(totalCount, 1)) * 100);
    const passed = score >= 60;
    const xpEarned = passed ? Math.round(score / 2) : 10;

    res.json({
      quizId: body.quizId,
      score,
      correctCount,
      totalCount,
      passed,
      xpEarned,
      questionResults,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit quiz");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/quiz/checkpoint/:level", async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    if (isNaN(level)) return res.status(400).json({ error: "Invalid level" });

    const checkpointQuestions = [
      {
        id: 1, type: "translation_choice",
        question: `Từ "你好" (nǐ hǎo) có nghĩa là gì?`,
        options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
        correctAnswer: "Xin chào", audioText: null,
      },
      {
        id: 2, type: "pinyin_input",
        question: `Nhập Pinyin cho: 谢谢`,
        options: null,
        correctAnswer: "xiè xiè", audioText: null,
      },
      {
        id: 3, type: "translation_choice",
        question: `"我爱你" nghĩa là gì?`,
        options: ["Tôi yêu bạn", "Tôi ghét bạn", "Tôi sợ bạn", "Tôi nhớ bạn"],
        correctAnswer: "Tôi yêu bạn", audioText: null,
      },
      {
        id: 4, type: "tone_selection",
        question: `"mā" thuộc thanh điệu nào?`,
        options: ["Thanh 1 (ngang)", "Thanh 2 (sắc)", "Thanh 3 (hỏi)", "Thanh 4 (nặng)"],
        correctAnswer: "Thanh 1 (ngang)", audioText: null,
      },
      {
        id: 5, type: "translation_choice",
        question: `Câu nào đúng về cấu trúc chủ-vị-tân trong tiếng Trung?`,
        options: ["我吃饭 (Tôi ăn cơm)", "吃我饭 (Ăn tôi cơm)", "饭吃我 (Cơm ăn tôi)", "吃饭我 (Ăn cơm tôi)"],
        correctAnswer: "我吃饭 (Tôi ăn cơm)", audioText: null,
      },
      {
        id: 6, type: "matching",
        question: `Từ nào có nghĩa là "nước"?`,
        options: ["水", "火", "木", "土"],
        correctAnswer: "水", audioText: null,
      },
      {
        id: 7, type: "translation_choice",
        question: `"多少钱?" có nghĩa là gì?`,
        options: ["Bao nhiêu tiền?", "Mấy giờ rồi?", "Bạn tên gì?", "Bạn bao nhiêu tuổi?"],
        correctAnswer: "Bao nhiêu tiền?", audioText: null,
      },
    ];

    const [quiz] = await db.insert(quizzesTable).values({
      lessonId: null,
      level,
      type: "checkpoint",
      questions: checkpointQuestions,
      totalQuestions: checkpointQuestions.length,
      timeLimit: 1800,
    }).returning();

    res.json({
      id: quiz.id,
      lessonId: null,
      level: quiz.level,
      type: quiz.type,
      questions: quiz.questions,
      totalQuestions: quiz.totalQuestions,
      timeLimit: quiz.timeLimit,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get checkpoint");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
