const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");
const authMiddleware = require("../../../../../shared/middlewares/authMiddleware");
const roleMiddleware = require("../../../../../shared/middlewares/roleMiddleware");

module.exports = (controller) => {
  const router = express.Router();
  router.use(authMiddleware);

  router.post("/", roleMiddleware(["MEDICO"]), asyncHandler(controller.iniciar));
 // router.get("/:id")
  router.put("/:id/finalizar", roleMiddleware(["MEDICO"]), asyncHandler(controller.finalizar));
  router.delete("/:id", roleMiddleware(["MEDICO"]), asyncHandler(controller.eliminar));

  return router;
};