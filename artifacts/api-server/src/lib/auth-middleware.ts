import type { Request, Response, NextFunction } from "express";
import { supabase } from "./supabase";

declare global {
  namespace Express {
    interface Request {
      authId?: string;
      dbUserId?: number;
    }
  }
}

export const GUEST_USER_ID = 6;

/** Returns the authenticated DB user id, falling back to the demo user. */
export function uid(req: Request): number {
  return req.dbUserId ?? GUEST_USER_ID;
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!supabase) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next();

  const token = authHeader.slice(7);
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user || !user.email) return next();

    req.authId = user.id;

    // Try to find existing user row by email
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .limit(1)
      .single();

    if (existing) {
      req.dbUserId = existing.id;
      return next();
    }

    // First sign-in: create a new user row
    const onboardingData = JSON.parse(
      sessionStorage.getItem("onboarding_data") ?? "",
    );
    const username =
      onboardingData.name ?? user.email?.split("@")[0] ?? "Học viên";
    const { data: created, error: createErr } = await supabase
      .from("users")
      .insert({
        username,
        email: user.email,
        password_hash: "",
        total_xp: 0,
        daily_goal: onboardingData.dailyGoalMinutes,
        current_streak: 0,
      })
      .select("id")
      .single();

    if (!createErr && created) req.dbUserId = created.id;
  } catch (e) {
    console.warn("[auth] Failed to resolve user from token:", e);
  }

  next();
}
