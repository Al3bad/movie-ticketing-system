import { Router } from "express";
import * as controller from "./controller.movie";

const router = Router();

router.get("/help", controller.help);

export default router;
