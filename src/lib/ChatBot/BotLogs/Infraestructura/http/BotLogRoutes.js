const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");

module.exports = (controller) => {
  const router = express.Router();
  router.post("/", asyncHandler(controller.registrar));
  router.get("/session/:chatSessionId", asyncHandler(controller.listarPorSession));
  return router;
};