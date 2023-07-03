import { Router } from "express";
import * as controller from "./ticket.controller";

const router = Router();

router.get("/help", controller.help);
router.get("/", controller.getAllTickets);

export default router;
