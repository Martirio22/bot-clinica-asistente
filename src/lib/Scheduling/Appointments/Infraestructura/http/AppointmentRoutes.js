const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");
const authMiddleware = require("../../../../../shared/middlewares/authMiddleware");

module.exports = (controller) => {
  const router = express.Router();

  // 1. Rutas de creación
  router.post("/", authMiddleware, asyncHandler((req, res) => controller.crear(req, res, { esBot: false })));
  router.post("/external/bot", asyncHandler((req, res) => controller.crear(req, res, { esBot: true })));

  router.get("/", authMiddleware, asyncHandler(controller.listar));
  router.get("/disponibilidad", asyncHandler(controller.disponibilidad));
  router.get("/:id", authMiddleware, asyncHandler(controller.obtener));
  router.put("/:id", authMiddleware, asyncHandler(controller.actualizar));
  router.delete("/:id", authMiddleware, asyncHandler(controller.eliminar));

  return router;
};