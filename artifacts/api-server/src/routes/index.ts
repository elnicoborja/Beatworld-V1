import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gameRouter from "./game";
import socialRouter from "./social";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/game", gameRouter);
router.use("/social", socialRouter);

export default router;
