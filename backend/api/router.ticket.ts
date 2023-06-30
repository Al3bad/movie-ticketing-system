import { Router } from "express";

const router = Router();

router.get("/help", (req, res) => {
  res.json({
    routes: [
      {
        endpoint: `${req.baseUrl}/`,
        description: "Get all tickets",
      },
      {
        endpoint: `${req.baseUrl}/<ticket-id>`,
        description: "Get ticket info by id",
      },
    ],
  });
});

export default router;
