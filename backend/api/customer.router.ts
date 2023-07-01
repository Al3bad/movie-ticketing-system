import { Router } from "express";
import * as controller from "./customer.controller";

const router = Router();

router.get("/help", controller.help);

export default router;
