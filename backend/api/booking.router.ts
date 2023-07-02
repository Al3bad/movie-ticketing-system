import { Router } from "express";
import * as controller from "./booking.controller";

const router = Router();

// /api/booking/...
router.get("/help", controller.help);
router.post("/", controller.createBooking);

export default router;
