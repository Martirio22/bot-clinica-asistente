const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");

module.exports = (controller) => {
  const router = express.Router();
  router.post("/", asyncHandler(controller.actualizar));
  router.get("/session/:chatSessionId", asyncHandler(controller.obtenerPorSession));
  return router;
};