import { Router } from "express";
import * as controller from "./ticket.controller";

const router = Router();

router.get("/help", controller.help);

export default router;
