import { Router } from "express";

const router = Router();

router.get("/help", (req, res) => {
  res.json({
    routes: [
      {
        endpoint: `${req.baseUrl}/`,
        description: "Get all customers",
      },
      {
        endpoint: `${req.baseUrl}/<customer-id>`,
        description: "Get customer info by id",
      },
    ],
  });
});

export default router;
