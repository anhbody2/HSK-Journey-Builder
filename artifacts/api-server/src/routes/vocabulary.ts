import { Router } from "express";
import { getMockVocabulary } from "../lib/mock-data";

const router = Router();

router.get("/vocabulary", (req, res) => {
  const level = req.query.level !== undefined ? parseInt(req.query.level as string) : undefined;
  const words = getMockVocabulary(isNaN(level as number) ? undefined : level);
  res.json(words);
});

export default router;
