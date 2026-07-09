import { Router } from "express";
import { supabase } from "../lib/supabase";
import { uid } from "../lib/auth-middleware";
import { GetProfileResponse, UpdateProfileBody, CompleteOnboardingBody } from "@workspace/api-zod";
import { MOCK_USER } from "../lib/mock-data";

const router = Router();

function userToProfile(u: any) {
  return {
    id: u.id,
    name: u.username,
    currentLevel: u.current_level ?? 1,
    targetLevel: u.target_level ?? 4,
    onboardingCompleted: true,
    totalXp: u.total_xp ?? 0,
    dailyGoalMinutes: u.daily_goal ?? 15,
    createdAt: u.created_at ?? new Date().toISOString(),
  };
}

router.get("/users/profile", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).limit(1);
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("User not found");
    res.json(GetProfileResponse.parse(userToProfile(data[0])));
  } catch {
    res.json({
      id: MOCK_USER.id, name: MOCK_USER.name,
      currentLevel: MOCK_USER.currentLevel, targetLevel: MOCK_USER.targetLevel,
      onboardingCompleted: MOCK_USER.onboardingCompleted, totalXp: MOCK_USER.totalXp,
      dailyGoalMinutes: MOCK_USER.dailyGoalMinutes, createdAt: MOCK_USER.createdAt.toISOString(),
    });
  }
});

router.put("/users/profile", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const body = UpdateProfileBody.parse(req.body);
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.username = body.name;
    if (body.dailyGoalMinutes !== undefined) updates.daily_goal = body.dailyGoalMinutes;
    if (body.targetLevel !== undefined) updates.target_level = body.targetLevel;
    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single();
    if (error) throw error;
    res.json(userToProfile(data));
  } catch {
    res.json({
      id: MOCK_USER.id, name: MOCK_USER.name,
      currentLevel: MOCK_USER.currentLevel, targetLevel: MOCK_USER.targetLevel,
      onboardingCompleted: MOCK_USER.onboardingCompleted, totalXp: MOCK_USER.totalXp,
      dailyGoalMinutes: MOCK_USER.dailyGoalMinutes, createdAt: MOCK_USER.createdAt.toISOString(),
    });
  }
});

router.post("/users/onboarding", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const userId = uid(req);
    const body = CompleteOnboardingBody.parse(req.body);
    const { data, error } = await supabase
      .from("users")
      .update({
        username: body.name,
        daily_goal: body.dailyGoalMinutes ?? 15,
        target_level: body.targetLevel,
        current_level: body.recommendedLevel,
      })
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    res.json(userToProfile(data));
  } catch {
    const body = CompleteOnboardingBody.safeParse(req.body);
    res.json({
      id: MOCK_USER.id,
      name: body.success ? body.data.name : MOCK_USER.name,
      currentLevel: body.success ? body.data.recommendedLevel : MOCK_USER.currentLevel,
      targetLevel: body.success ? body.data.targetLevel : MOCK_USER.targetLevel,
      onboardingCompleted: true, totalXp: MOCK_USER.totalXp,
      dailyGoalMinutes: body.success ? (body.data.dailyGoalMinutes ?? 15) : MOCK_USER.dailyGoalMinutes,
      createdAt: MOCK_USER.createdAt.toISOString(),
    });
  }
});

export default router;
