const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");
module.exports = (controller) => { const router=express.Router(); router.post("/", asyncHandler(controller.crear)); router.get("/message/:chatMessageId", asyncHandler(controller.listarPorMessage)); return router; };
