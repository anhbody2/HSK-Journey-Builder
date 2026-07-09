import { Router } from "express";
import { supabase } from "../lib/supabase";
import { getMockVocabulary } from "../lib/mock-data";

const router = Router();

router.get("/vocabulary", async (req, res) => {
  try {
    if (!supabase) throw new Error("No Supabase client");
    const level = req.query.level !== undefined ? parseInt(req.query.level as string) : undefined;
    let query = supabase.from("vocabulary").select("*, vocabulary_translations(*)");
    if (level !== undefined && !isNaN(level)) query = query.eq("hsk_level", level) as any;

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No vocabulary in DB");

    res.json((data ?? []).map((v: any) => {
      const trans = v.vocabulary_translations?.[0];
      return {
        id: v.id, level: v.hsk_level,
        chinese: v.simplified, pinyin: v.pinyin,
        meaning: trans?.definition ?? trans?.meaning ?? "",
        exampleChinese: trans?.example_sentence ?? trans?.example_chinese ?? "",
        examplePinyin: trans?.example_pinyin ?? "",
        exampleMeaning: trans?.example_meaning ?? "",
      };
    }));
  } catch {
    const level = req.query.level !== undefined ? parseInt(req.query.level as string) : undefined;
    res.json(getMockVocabulary(isNaN(level as number) ? undefined : level));
  }
});

export default router;
