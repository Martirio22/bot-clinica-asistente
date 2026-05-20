const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");
const authMiddleware = require("../../../../../shared/middlewares/authMiddleware");

module.exports = (controller) => {
  const router = express.Router();
  router.use(authMiddleware);

  router.post("/", asyncHandler(controller.crear));
  router.get("/", asyncHandler(controller.listar));
  router.get("/:id", asyncHandler(controller.obtener));
  router.put("/:id/assign-human", asyncHandler(controller.asignarAsistente));
  router.put("/:id/close", asyncHandler(controller.cerrar));

  return router;
};