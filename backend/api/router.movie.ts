import { Router } from "express";

const router = Router();

router.get("/help", (req, res) => {
  res.json({
    routes: [
      {
        endpoint: `${req.baseUrl}/`,
        description: "Get all movies",
      },
      {
        endpoint: `${req.baseUrl}/<movie-id>`,
        description: "Get movie info by id",
      },
    ],
  });
});

export default router;
