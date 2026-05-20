import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetProfileResponse, UpdateProfileBody, CompleteOnboardingBody } from "@workspace/api-zod";

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
  } catch (err) {
    req.log.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "Internal server error" });
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
  } catch (err) {
    req.log.error({ err }, "Failed to update profile");
    res.status(400).json({ error: "Invalid request" });
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
  } catch (err) {
    req.log.error({ err }, "Failed to complete onboarding");
    res.status(400).json({ error: "Invalid request" });
  }
});

export default router;
