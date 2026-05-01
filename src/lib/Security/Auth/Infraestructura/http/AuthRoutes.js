const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");
const authMiddleware = require("../../../../../shared/middlewares/authMiddleware");
module.exports = (controller) => {
  const router = express.Router();
  router.post("/register", asyncHandler(controller.register));
  router.post("/login", asyncHandler(controller.login));
  router.post("/refresh-token", asyncHandler(controller.refresh));
  router.post("/logout", authMiddleware, asyncHandler(controller.logout));
  router.get("/me", authMiddleware, asyncHandler(controller.me));
  return router;
};
