const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");
const authMiddleware = require("../../../../../shared/middlewares/authMiddleware");
module.exports = (controller) => {
  const router = express.Router();
  router.use(authMiddleware);
  router.post("/", asyncHandler(controller.asignar));
  router.get("/", asyncHandler(controller.listar));
  router.get("/users/:userId/roles", asyncHandler(controller.listarRolesPorUser));
  router.delete("/users/:userId/roles/:roleId", asyncHandler(controller.remover));
  return router;
};
