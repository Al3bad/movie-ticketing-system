import { Router } from "express";
import { httpStatus } from "server";

export const initRouter = (base: string, routes: Backend.Route[]) => {
  const re = new RegExp("^/\\S+(?<!/)$");
  if (!re.test(base)) {
    console.log(`Invalid base API url! (${base})`);
    process.exit(1);
  }
  // ==============================================
  // ==> Mount Routes
  // ==============================================
  const router = Router();
  routes.forEach((route) => {
    const { method, endpoint, controller } = route;
    if (controller) router[method](endpoint, controller);
  });

  // ==============================================
  // ==> Mount Help Route
  // ==============================================
  const helpObj = routes.map((route) => {
    route.endpoint = `${base}${route.endpoint}`;
    delete route.controller;
    return route;
  });

  router.get("/help", (_, res) => {
    res.json({
      routes: helpObj,
    });
  });

  // ==============================================
  // ==> Not Found route handler
  // ==============================================
  router.use((_, res) => {
    res.status(httpStatus.NOT_FOUND);
    res.json({
      routes: helpObj,
    });
  });
  return router;
};
