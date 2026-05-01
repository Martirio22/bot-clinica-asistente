const express = require("express");
const asyncHandler = require("../../../../../shared/middlewares/asyncHandler");
const webhookTokenMiddleware = require("../../../../../shared/middlewares/webhookTokenMiddleware");
module.exports = (controller) => { const router=express.Router(); router.post("/whatsapp", webhookTokenMiddleware, asyncHandler(controller.recibirWhatsapp)); return router; };
