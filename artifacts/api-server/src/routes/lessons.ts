import { Router } from "express";
import { db, lessonsTable, lessonProgressTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { GetLessonsQueryParams } from "@workspace/api-zod";
import { getMockLessons, getMockDailyTasks, MOCK_LESSONS, MOCK_USER } from "../lib/mock-data";

const router = Router();

router.get("/lessons", async (req, res) => {
  try {
    const params = GetLessonsQueryParams.parse(req.query);
    let query = db.select().from(lessonsTable);

    const conditions = [];
    if (params.level !== undefined) conditions.push(eq(lessonsTable.level, params.level));
    if (params.unit !== undefined) conditions.push(eq(lessonsTable.unit, params.unit));

    const lessons = conditions.length > 0
      ? await db.select().from(lessonsTable).where(and(...conditions)).orderBy(lessonsTable.unit, lessonsTable.lessonNumber)
      : await db.select().from(lessonsTable).orderBy(lessonsTable.level, lessonsTable.unit, lessonsTable.lessonNumber);

    const progress = await db.select().from(lessonProgressTable).where(
      and(eq(lessonProgressTable.userId, 1), eq(lessonProgressTable.step, "quiz"))
    );
    const completedIds = new Set(progress.filter(p => p.isCompleted).map(p => p.lessonId));
    const user = await db.select().from(usersTable).where(eq(usersTable.id, 1)).limit(1);
    const currentLevel = user[0]?.currentLevel ?? 1;

    res.json(lessons.map((l) => ({
      id: l.id,
      level: l.level,
      unit: l.unit,
      lessonNumber: l.lessonNumber,
      title: l.title,
      titleChinese: l.titleChinese,
      type: l.type,
      isLocked: l.level > currentLevel,
      isCompleted: completedIds.has(l.id),
      xpReward: l.xpReward,
      estimatedMinutes: l.estimatedMinutes,
    })));
  } catch {
    const params = GetLessonsQueryParams.safeParse(req.query);
    const levelFilter = params.success ? params.data.level : undefined;
    const unitFilter = params.success ? params.data.unit : undefined;
    let lessons = getMockLessons();
    if (levelFilter !== undefined) lessons = lessons.filter(l => l.level === levelFilter);
    if (unitFilter !== undefined) lessons = lessons.filter(l => l.unit === unitFilter);
    res.json(lessons);
  }
});

router.get("/lessons/daily", async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, 1)).limit(1);
    const currentLevel = user[0]?.currentLevel ?? 1;
    const dailyGoal = user[0]?.dailyGoalMinutes ?? 15;

    const lessons = await db.select().from(lessonsTable)
      .where(eq(lessonsTable.level, currentLevel))
      .orderBy(lessonsTable.unit, lessonsTable.lessonNumber)
      .limit(4);

    const progress = await db.select().from(lessonProgressTable).where(
      and(eq(lessonProgressTable.userId, 1), eq(lessonProgressTable.step, "quiz"))
    );
    const completedIds = new Set(progress.filter(p => p.isCompleted).map(p => p.lessonId));

    const today = new Date().toISOString().split("T")[0];
    const tasks = lessons.map((l, i) => ({
      lessonId: l.id,
      title: l.title,
      type: l.type,
      estimatedMinutes: l.estimatedMinutes,
      isCompleted: completedIds.has(l.id),
      order: i + 1,
    }));

    const completedMinutes = tasks.filter(t => t.isCompleted).reduce((s, t) => s + t.estimatedMinutes, 0);

    res.json({
      date: today,
      totalMinutes: dailyGoal,
      completedMinutes,
      tasks,
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id)).limit(1);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    res.json({
      id: lesson.id,
      level: lesson.level,
      unit: lesson.unit,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      titleChinese: lesson.titleChinese,
      type: lesson.type,
      dialogue: lesson.dialogue,
      vocabulary: lesson.vocabulary,
      grammarPoints: lesson.grammarPoints,
      shadowingText: lesson.shadowingText,
      shadowingPinyin: lesson.shadowingPinyin,
    });
  } catch {
    const id = parseInt(req.params.id);
    const lesson = MOCK_LESSONS.find(l => l.id === id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json({
      id: lesson.id,
      level: lesson.level,
      unit: lesson.unit,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      titleChinese: lesson.titleChinese,
      type: lesson.type,
      dialogue: null,
      vocabulary: null,
      grammarPoints: null,
      shadowingText: null,
      shadowingPinyin: null,
    });
  }
});

export default router;
