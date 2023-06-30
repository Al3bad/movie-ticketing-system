import { Router } from "express";
import * as controller from "./controller.booking";

const router = Router();

router.get("/help", controller.help);

export default router;
