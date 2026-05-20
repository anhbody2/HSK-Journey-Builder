import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import lessonsRouter from "./lessons";
import progressRouter from "./progress";
import shadowingRouter from "./shadowing";
import quizRouter from "./quiz";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(lessonsRouter);
router.use(progressRouter);
router.use(shadowingRouter);
router.use(quizRouter);

export default router;
