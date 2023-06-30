import { Router } from "express";
import * as controller from "./controller.ticket";

const router = Router();

router.get("/help", controller.help);

export default router;
