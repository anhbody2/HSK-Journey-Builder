import { Router } from "express";
import { db, lessonProgressTable, dailyActivityTable, usersTable, lessonsTable } from "@workspace/db";
import { eq, and, desc, count } from "drizzle-orm";
import { UpdateLessonProgressBody, UpdateLessonProgressParams } from "@workspace/api-zod";

const router = Router();

router.get("/progress", async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, 1)).limit(1);
    const u = user[0];
    if (!u) return res.status(404).json({ error: "User not found" });

    const allProgress = await db.select().from(lessonProgressTable)
      .where(and(eq(lessonProgressTable.userId, 1), eq(lessonProgressTable.step, "quiz"), eq(lessonProgressTable.isCompleted, true)));

    const [{ totalLessons }] = await db.select({ totalLessons: count() }).from(lessonsTable)
      .where(eq(lessonsTable.level, u.currentLevel));

    const weeklyActivity = await db.select().from(dailyActivityTable)
      .where(eq(dailyActivityTable.userId, 1))
      .orderBy(desc(dailyActivityTable.date))
      .limit(7);

    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const today = new Date();
    const weeklyXp = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      const act = weeklyActivity.find(a => a.date === dateStr);
      return { day: days[d.getDay()], xp: act?.xpEarned ?? 0 };
    });

    const levelProgress = allProgress.filter(p => {
      // approximation: completedLessons within current level
      return true;
    });

    res.json({
      currentLevel: u.currentLevel,
      currentUnit: 1,
      completedLessons: allProgress.length,
      totalLessons: totalLessons || 1,
      levelProgressPercent: Math.min(100, Math.round((allProgress.length / Math.max(totalLessons, 1)) * 100)),
      vocabularyLearned: allProgress.length * 8,
      totalXp: u.totalXp,
      weeklyXp,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/progress/lessons/:lessonId", async (req, res) => {
  try {
    const params = UpdateLessonProgressParams.parse(req.params);
    const body = UpdateLessonProgressBody.parse(req.body);
    const lessonId = params.lessonId;

    const existing = await db.select().from(lessonProgressTable)
      .where(and(
        eq(lessonProgressTable.userId, 1),
        eq(lessonProgressTable.lessonId, lessonId),
        eq(lessonProgressTable.step, body.step)
      )).limit(1);

    let result;
    if (existing.length > 0) {
      [result] = await db.update(lessonProgressTable)
        .set({
          isCompleted: body.isCompleted,
          score: body.score ?? null,
          completedAt: body.isCompleted ? new Date() : null,
        })
        .where(eq(lessonProgressTable.id, existing[0].id))
        .returning();
    } else {
      [result] = await db.insert(lessonProgressTable).values({
        userId: 1,
        lessonId,
        step: body.step,
        isCompleted: body.isCompleted,
        score: body.score ?? null,
        completedAt: body.isCompleted ? new Date() : null,
      }).returning();
    }

    if (body.isCompleted && body.step === "quiz") {
      const today = new Date().toISOString().split("T")[0];
      const xpGain = 50;
      const existing = await db.select().from(dailyActivityTable)
        .where(and(eq(dailyActivityTable.userId, 1), eq(dailyActivityTable.date, today))).limit(1);
      if (existing.length > 0) {
        await db.update(dailyActivityTable)
          .set({ xpEarned: existing[0].xpEarned + xpGain, minutesStudied: existing[0].minutesStudied + 10 })
          .where(eq(dailyActivityTable.id, existing[0].id));
      } else {
        await db.insert(dailyActivityTable).values({ userId: 1, date: today, xpEarned: xpGain, minutesStudied: 10 });
      }
      await db.update(usersTable).set({ totalXp: (await db.select().from(usersTable).where(eq(usersTable.id, 1)).limit(1))[0].totalXp + xpGain }).where(eq(usersTable.id, 1));
    }

    res.json({
      lessonId,
      step: result.step,
      isCompleted: result.isCompleted,
      score: result.score ?? null,
      completedAt: result.completedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update lesson progress");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/progress/streak", async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, 1)).limit(1);
    const u = user[0];
    if (!u) return res.status(404).json({ error: "User not found" });

    const today = new Date().toISOString().split("T")[0];
    const studiedToday = u.lastStudyDate === today;

    res.json({
      currentStreak: u.currentStreak,
      longestStreak: u.longestStreak,
      lastStudyDate: u.lastStudyDate ?? null,
      studiedToday,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get streak");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/dashboard", async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, 1)).limit(1);
    const u = user[0];
    if (!u) return res.status(404).json({ error: "User not found" });

    const allProgress = await db.select().from(lessonProgressTable)
      .where(and(eq(lessonProgressTable.userId, 1), eq(lessonProgressTable.step, "quiz"), eq(lessonProgressTable.isCompleted, true)));

    const weeklyActivity = await db.select().from(dailyActivityTable)
      .where(eq(dailyActivityTable.userId, 1))
      .orderBy(desc(dailyActivityTable.date))
      .limit(7);

    const today = new Date().toISOString().split("T")[0];
    const todayActivity = weeklyActivity.find(a => a.date === today);

    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const todayDate = new Date();
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(todayDate);
      d.setDate(todayDate.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      const act = weeklyActivity.find(a => a.date === dateStr);
      return { day: days[d.getDay()], xp: act?.xpEarned ?? 0, minutes: act?.minutesStudied ?? 0 };
    });

    res.json({
      totalXp: u.totalXp,
      currentLevel: u.currentLevel,
      targetLevel: u.targetLevel,
      levelProgressPercent: Math.min(100, Math.round((allProgress.length / 6) * 100)),
      vocabularyLearned: allProgress.length * 8,
      completedLessons: allProgress.length,
      currentStreak: u.currentStreak,
      todayMinutes: todayActivity?.minutesStudied ?? 0,
      dailyGoalMinutes: u.dailyGoalMinutes,
      weeklyActivity: weeklyData,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
