import { Router } from "express";
import * as controller from "./controller.customer";

const router = Router();

router.get("/help", controller.help);

export default router;
