import { Router } from "express";

const router = Router();

router.get("/help", (req, res) => {
  res.json({
    routes: [
      {
        endpoint: `${req.baseUrl}/`,
        description: "Get all bookings",
      },
      {
        endpoint: `${req.baseUrl}/<booking-id>`,
        description: "Get booking info by id",
      },
    ],
  });
});

export default router;
