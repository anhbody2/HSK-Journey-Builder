import { Router } from "express";
import { supabase } from "../lib/supabase";
import { uid } from "../lib/auth-middleware";
import { GetLessonsQueryParams } from "@workspace/api-zod";
import { getMockLessons, getMockDailyTasks, MOCK_LESSONS } from "../lib/mock-data";

const router = Router();

router.get("/lessons", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const params = GetLessonsQueryParams.safeParse(req.query);
    let query = supabase.from("lessons").select("*, units(*)").order("order_index");
    if (params.success && params.data.unit !== undefined) {
      query = query.eq("unit_id", params.data.unit) as any;
    }
    const { data: lessons, error } = await query;
    if (error) throw error;

    const { data: attempts } = await supabase
      .from("lesson_attempts").select("lesson_id")
      .eq("user_id", userId).eq("is_completed", true);
    const completedIds = new Set((attempts ?? []).map((a: any) => a.lesson_id));

    res.json((lessons ?? []).map((l: any) => ({
      id: l.id,
      level: l.units?.hsk_level ?? 1,
      unit: l.unit_id,
      lessonNumber: l.order_index,
      title: l.title,
      titleChinese: l.title_chinese ?? "",
      type: l.type ?? "dialogue",
      isLocked: false,
      isCompleted: completedIds.has(l.id),
      xpReward: l.xp_reward ?? 10,
      estimatedMinutes: l.estimated_minutes ?? 10,
    })));
  } catch {
    const params = GetLessonsQueryParams.safeParse(req.query);
    let lessons = getMockLessons();
    if (params.success && params.data.level !== undefined) lessons = lessons.filter(l => l.level === params.data.level);
    if (params.success && params.data.unit !== undefined) lessons = lessons.filter(l => l.unit === params.data.unit);
    res.json(lessons);
  }
});

router.get("/lessons/daily", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const { data: userRow } = await supabase.from("users").select("daily_goal").eq("id", userId).limit(1);
    const dailyGoal = userRow?.[0]?.daily_goal ?? 15;

    const { data: lessons, error } = await supabase.from("lessons").select("*").order("order_index").limit(4);
    if (error) throw error;

    const { data: attempts } = await supabase
      .from("lesson_attempts").select("lesson_id")
      .eq("user_id", userId).eq("is_completed", true);
    const completedIds = new Set((attempts ?? []).map((a: any) => a.lesson_id));
    const today = new Date().toISOString().split("T")[0];

    const tasks = (lessons ?? []).map((l: any, i: number) => ({
      lessonId: l.id, title: l.title, type: l.type ?? "dialogue",
      estimatedMinutes: l.estimated_minutes ?? 10,
      isCompleted: completedIds.has(l.id), order: i + 1,
    }));
    const completedMinutes = tasks.filter(t => t.isCompleted).reduce((s, t) => s + t.estimatedMinutes, 0);
    res.json({
      date: today, totalMinutes: dailyGoal, completedMinutes, tasks,
      motivationMessage: completedMinutes >= dailyGoal
        ? "Tuyệt vời! Bạn đã hoàn thành mục tiêu hôm nay!"
        : "Hãy tiếp tục! Mỗi ngày một bước, bạn sẽ thành công!",
    });
  } catch {
    res.json(getMockDailyTasks());
  }
});

router.get("/lessons/:id", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const { data, error } = await supabase.from("lessons").select("*, units(*)").eq("id", id).limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: "Lesson not found" });
    const l = data[0];
    res.json({
      id: l.id, level: l.units?.hsk_level ?? 1, unit: l.unit_id,
      lessonNumber: l.order_index, title: l.title,
      titleChinese: l.title_chinese ?? "", type: l.type ?? "dialogue",
      dialogue: l.dialogue ?? null, vocabulary: l.vocabulary ?? null,
      grammarPoints: l.grammar_points ?? null,
      shadowingText: l.shadowing_text ?? null, shadowingPinyin: l.shadowing_pinyin ?? null,
    });
  } catch {
    const id = parseInt(req.params.id);
    const lesson = MOCK_LESSONS.find(l => l.id === id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json({
      id: lesson.id, level: lesson.level, unit: lesson.unit,
      lessonNumber: lesson.lessonNumber, title: lesson.title,
      titleChinese: lesson.titleChinese, type: lesson.type,
      dialogue: null, vocabulary: null, grammarPoints: null,
      shadowingText: null, shadowingPinyin: null,
    });
  }
});

export default router;
