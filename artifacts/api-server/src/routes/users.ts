import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetProfileResponse, UpdateProfileBody, CompleteOnboardingBody } from "@workspace/api-zod";
import { MOCK_USER } from "../lib/mock-data";

const router = Router();

async function getOrCreateUser() {
  const existing = await db.select().from(usersTable).where(eq(usersTable.id, 1)).limit(1);
  if (existing.length > 0) return existing[0];
  const [created] = await db.insert(usersTable).values({ id: 1, name: "Học viên" } as any).returning();
  return created;
}

router.get("/users/profile", async (req, res) => {
  try {
    const user = await getOrCreateUser();
    const profile = GetProfileResponse.parse({
      id: user.id,
      name: user.name,
      currentLevel: user.currentLevel,
      targetLevel: user.targetLevel,
      onboardingCompleted: user.onboardingCompleted,
      totalXp: user.totalXp,
      dailyGoalMinutes: user.dailyGoalMinutes,
      createdAt: user.createdAt.toISOString(),
    });
    res.json(profile);
  } catch {
    res.json({
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      currentLevel: MOCK_USER.currentLevel,
      targetLevel: MOCK_USER.targetLevel,
      onboardingCompleted: MOCK_USER.onboardingCompleted,
      totalXp: MOCK_USER.totalXp,
      dailyGoalMinutes: MOCK_USER.dailyGoalMinutes,
      createdAt: MOCK_USER.createdAt.toISOString(),
    });
  }
});

router.put("/users/profile", async (req, res) => {
  try {
    const body = UpdateProfileBody.parse(req.body);
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.targetLevel !== undefined) updates.targetLevel = body.targetLevel;
    if (body.dailyGoalMinutes !== undefined) updates.dailyGoalMinutes = body.dailyGoalMinutes;

    const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, 1)).returning();
    res.json({
      id: updated.id,
      name: updated.name,
      currentLevel: updated.currentLevel,
      targetLevel: updated.targetLevel,
      onboardingCompleted: updated.onboardingCompleted,
      totalXp: updated.totalXp,
      dailyGoalMinutes: updated.dailyGoalMinutes,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch {
    res.json({
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      currentLevel: MOCK_USER.currentLevel,
      targetLevel: MOCK_USER.targetLevel,
      onboardingCompleted: MOCK_USER.onboardingCompleted,
      totalXp: MOCK_USER.totalXp,
      dailyGoalMinutes: MOCK_USER.dailyGoalMinutes,
      createdAt: MOCK_USER.createdAt.toISOString(),
    });
  }
});

router.post("/users/onboarding", async (req, res) => {
  try {
    const body = CompleteOnboardingBody.parse(req.body);
    const [updated] = await db
      .update(usersTable)
      .set({
        name: body.name,
        targetLevel: body.targetLevel,
        currentLevel: body.recommendedLevel,
        onboardingCompleted: true,
        dailyGoalMinutes: body.dailyGoalMinutes ?? 15,
      })
      .where(eq(usersTable.id, 1))
      .returning();
    res.json({
      id: updated.id,
      name: updated.name,
      currentLevel: updated.currentLevel,
      targetLevel: updated.targetLevel,
      onboardingCompleted: updated.onboardingCompleted,
      totalXp: updated.totalXp,
      dailyGoalMinutes: updated.dailyGoalMinutes,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch {
    const body = CompleteOnboardingBody.safeParse(req.body);
    res.json({
      id: MOCK_USER.id,
      name: body.success ? body.data.name : MOCK_USER.name,
      currentLevel: body.success ? body.data.recommendedLevel : MOCK_USER.currentLevel,
      targetLevel: body.success ? body.data.targetLevel : MOCK_USER.targetLevel,
      onboardingCompleted: true,
      totalXp: MOCK_USER.totalXp,
      dailyGoalMinutes: body.success ? (body.data.dailyGoalMinutes ?? 15) : MOCK_USER.dailyGoalMinutes,
      createdAt: MOCK_USER.createdAt.toISOString(),
    });
  }
});

export default router;
