import { Router } from "express";
import { supabase } from "../lib/supabase";
import { uid } from "../lib/auth-middleware";
import { UpdateLessonProgressBody, UpdateLessonProgressParams } from "@workspace/api-zod";
import { getMockDashboardStats, MOCK_USER, MOCK_COMPLETED_IDS } from "../lib/mock-data";

const router = Router();

router.get("/progress", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const { data: userRows, error: uErr } = await supabase.from("users").select("*").eq("id", userId).limit(1);
    if (uErr) throw uErr;
    const u = userRows?.[0];
    if (!u) throw new Error("User not found");

    const { data: completed } = await supabase.from("lesson_attempts")
      .select("id").eq("user_id", userId).eq("is_completed", true);
    const { count: totalLessons } = await supabase.from("lessons").select("*", { count: "exact", head: true });

    const total = totalLessons ?? 1;
    const done = completed?.length ?? 0;
    res.json({
      currentLevel: u.current_level ?? 1, currentUnit: 1,
      completedLessons: done, totalLessons: total,
      levelProgressPercent: Math.min(100, Math.round((done / Math.max(total, 1)) * 100)),
      vocabularyLearned: done * 8, totalXp: u.total_xp ?? 0, weeklyXp: [],
    });
  } catch {
    const stats = getMockDashboardStats();
    res.json({
      currentLevel: MOCK_USER.currentLevel, currentUnit: 1,
      completedLessons: MOCK_COMPLETED_IDS.size, totalLessons: 8,
      levelProgressPercent: Math.round((MOCK_COMPLETED_IDS.size / 8) * 100),
      vocabularyLearned: MOCK_COMPLETED_IDS.size * 8, totalXp: MOCK_USER.totalXp,
      weeklyXp: stats.weeklyActivity.map(w => ({ day: w.day, xp: w.xp })),
    });
  }
});

router.post("/progress/lessons/:lessonId", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const params = UpdateLessonProgressParams.parse(req.params);
    const body = UpdateLessonProgressBody.parse(req.body);

    const { data: attempt, error } = await supabase.from("lesson_attempts")
      .insert({ user_id: userId, lesson_id: params.lessonId, is_completed: body.isCompleted })
      .select().single();
    if (error) throw error;

    if (body.isCompleted) {
      const { data: userRows } = await supabase.from("users").select("total_xp").eq("id", userId).limit(1);
      const currentXp = userRows?.[0]?.total_xp ?? 0;
      await supabase.from("users").update({ total_xp: currentXp + 50 }).eq("id", userId);
    }

    res.json({
      lessonId: params.lessonId, step: body.step,
      isCompleted: attempt.is_completed, score: null,
      completedAt: attempt.created_at ?? null,
    });
  } catch {
    const params = UpdateLessonProgressParams.safeParse(req.params);
    const body = UpdateLessonProgressBody.safeParse(req.body);
    res.json({
      lessonId: params.success ? params.data.lessonId : 0,
      step: body.success ? body.data.step : "quiz",
      isCompleted: body.success ? body.data.isCompleted : false,
      score: null, completedAt: null,
    });
  }
});

router.get("/progress/streak", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const { data: userRows, error } = await supabase.from("users").select("*").eq("id", userId).limit(1);
    if (error) throw error;
    const u = userRows?.[0];
    if (!u) throw new Error("User not found");
    const today = new Date().toISOString().split("T")[0];
    res.json({
      currentStreak: u.current_streak ?? 0, longestStreak: 0,
      lastStudyDate: u.last_active_date ?? null,
      studiedToday: u.last_active_date === today,
    });
  } catch {
    res.json({
      currentStreak: MOCK_USER.currentStreak, longestStreak: MOCK_USER.longestStreak,
      lastStudyDate: MOCK_USER.lastStudyDate, studiedToday: true,
    });
  }
});

router.get("/stats/dashboard", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const { data: userRows, error } = await supabase.from("users").select("*").eq("id", userId).limit(1);
    if (error) throw error;
    const u = userRows?.[0];
    if (!u) throw new Error("User not found");

    const { data: completed } = await supabase.from("lesson_attempts")
      .select("id").eq("user_id", userId).eq("is_completed", true);
    const done = completed?.length ?? 0;

    res.json({
      totalXp: u.total_xp ?? 0,
      currentLevel: u.current_level ?? 1,
      targetLevel: u.target_level ?? 4,
      levelProgressPercent: Math.min(100, Math.round((done / 8) * 100)),
      vocabularyLearned: done * 8, completedLessons: done,
      currentStreak: u.current_streak ?? 0,
      todayMinutes: 10, dailyGoalMinutes: u.daily_goal ?? 15, weeklyActivity: [],
    });
  } catch {
    res.json(getMockDashboardStats());
  }
});

export default router;
