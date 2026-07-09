import { Router } from "express";
import { supabase } from "../lib/supabase";
import { GenerateQuizBody, SubmitQuizBody } from "@workspace/api-zod";

const router = Router();

const CHECKPOINT_QUESTIONS = [
  { id: 1, type: "translation_choice", question: 'Từ "你好" (nǐ hǎo) có nghĩa là gì?', options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], correctAnswer: "Xin chào", audioText: null },
  { id: 2, type: "pinyin_input", question: "Nhập Pinyin cho: 谢谢", options: null, correctAnswer: "xiè xiè", audioText: null },
  { id: 3, type: "translation_choice", question: '"我爱你" nghĩa là gì?', options: ["Tôi yêu bạn", "Tôi ghét bạn", "Tôi sợ bạn", "Tôi nhớ bạn"], correctAnswer: "Tôi yêu bạn", audioText: null },
  { id: 4, type: "tone_selection", question: '"mā" thuộc thanh điệu nào?', options: ["Thanh 1 (ngang)", "Thanh 2 (sắc)", "Thanh 3 (hỏi)", "Thanh 4 (nặng)"], correctAnswer: "Thanh 1 (ngang)", audioText: null },
  { id: 5, type: "translation_choice", question: "Câu nào đúng về cấu trúc chủ-vị-tân trong tiếng Trung?", options: ["我吃饭 (Tôi ăn cơm)", "吃我饭 (Ăn tôi cơm)", "饭吃我 (Cơm ăn tôi)", "吃饭我 (Ăn cơm tôi)"], correctAnswer: "我吃饭 (Tôi ăn cơm)", audioText: null },
  { id: 6, type: "matching", question: 'Từ nào có nghĩa là "nước"?', options: ["水", "火", "木", "土"], correctAnswer: "水", audioText: null },
  { id: 7, type: "translation_choice", question: '"多少钱?" có nghĩa là gì?', options: ["Bao nhiêu tiền?", "Mấy giờ rồi?", "Bạn tên gì?", "Bạn bao nhiêu tuổi?"], correctAnswer: "Bao nhiêu tiền?", audioText: null },
];

function buildDefaultQuestions() {
  return [
    { id: 1, type: "translation_choice", question: 'Từ "你好" (nǐ hǎo) có nghĩa là gì?', options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], correctAnswer: "Xin chào", audioText: null },
    { id: 2, type: "translation_choice", question: 'Từ "谢谢" có nghĩa là gì?', options: ["Cảm ơn", "Xin chào", "Tạm biệt", "Xin lỗi"], correctAnswer: "Cảm ơn", audioText: null },
    { id: 3, type: "translation_choice", question: '"再见" có nghĩa là gì?', options: ["Tạm biệt", "Xin chào", "Cảm ơn", "Xin lỗi"], correctAnswer: "Tạm biệt", audioText: null },
  ];
}

router.post("/quiz/generate", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const body = GenerateQuizBody.parse(req.body);
    const { data: exercises } = await supabase
      .from("exercises").select("*, exercise_options(*)")
      .eq("lesson_id", body.lessonId).limit(5);

    const questions = (exercises ?? []).map((ex: any, i: number) => ({
      id: i + 1, type: ex.type, question: ex.question,
      options: ex.exercise_options?.map((o: any) => o.option_text) ?? null,
      correctAnswer: ex.exercise_options?.find((o: any) => o.is_correct)?.option_text ?? "",
      audioText: null,
    }));

    const finalQuestions = questions.length > 0 ? questions : buildDefaultQuestions();
    res.json({
      id: body.lessonId * 100, lessonId: body.lessonId, level: 1,
      type: "mini_quiz", questions: finalQuestions,
      totalQuestions: finalQuestions.length, timeLimit: null,
    });
  } catch {
    const body = GenerateQuizBody.safeParse(req.body);
    const questions = buildDefaultQuestions();
    res.json({
      id: (body.success ? body.data.lessonId : 0) * 100,
      lessonId: body.success ? body.data.lessonId : 0,
      level: 1, type: "mini_quiz", questions,
      totalQuestions: questions.length, timeLimit: null,
    });
  }
});

router.post("/quiz/submit", async (req, res) => {
  try {
    const body = SubmitQuizBody.parse(req.body);
    const questions = buildDefaultQuestions();
    const questionResults = body.answers.map(answer => {
      const q = questions.find(q => q.id === answer.questionId);
      const isCorrect = q ? answer.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() : false;
      return { questionId: answer.questionId, isCorrect, correctAnswer: q?.correctAnswer ?? "", userAnswer: answer.answer };
    });
    const correctCount = questionResults.filter(r => r.isCorrect).length;
    const totalCount = Math.max(questions.length, 1);
    const score = Math.round((correctCount / totalCount) * 100);
    const passed = score >= 60;
    res.json({ quizId: body.quizId, score, correctCount, totalCount, passed, xpEarned: passed ? Math.round(score / 2) : 10, questionResults });
  } catch {
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/quiz/checkpoint/:level", async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    if (isNaN(level)) return res.status(400).json({ error: "Invalid level" });
    res.json({ id: level * 1000, lessonId: null, level, type: "checkpoint", questions: CHECKPOINT_QUESTIONS, totalQuestions: CHECKPOINT_QUESTIONS.length, timeLimit: 1800 });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
