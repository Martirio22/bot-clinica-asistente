const UnauthorizedError = require("../errors/UnauthorizedError");

function webhookTokenMiddleware(req, res, next) {
  const token = req.header("x-webhook-token");
  const expected = process.env.WEBHOOK_SERVICE_TOKEN;

  if (!expected) {
    return next(new UnauthorizedError("WEBHOOK_SERVICE_TOKEN no está configurado"));
  }

  if (!token || token !== expected) {
    return next(new UnauthorizedError("Webhook no autorizado"));
  }

  next();
}

module.exports = webhookTokenMiddleware;
