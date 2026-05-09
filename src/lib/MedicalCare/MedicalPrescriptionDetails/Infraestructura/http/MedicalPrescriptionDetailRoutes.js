const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");
const authMiddleware = require("../../../../../shared/middlewares/authMiddleware");
const roleMiddleware = require("../../../../../shared/middlewares/roleMiddleware");

module.exports = (controller) => {
  const router = express.Router();
  router.use(authMiddleware);

router.post("/", roleMiddleware(["MEDICO"]), asyncHandler(controller.crear));
router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.obtener));
router.put("/:id", roleMiddleware(["MEDICO"]), asyncHandler(controller.actualizar));
router.delete("/:id", roleMiddleware(["MEDICO"]), asyncHandler(controller.eliminar));

  return router;
};