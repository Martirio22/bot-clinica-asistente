const UnauthorizedError = require("../errors/UnauthorizedError");
const TokenService = require("../security/TokenService");

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new UnauthorizedError("Token no enviado"));
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new UnauthorizedError("Formato de token inválido"));
  }

  try {
    const tokenService = new TokenService();
    req.user = tokenService.verifyAccessToken(token);
    next();
  } catch (error) {
    next(new UnauthorizedError("Token inválido o expirado"));
  }
}

module.exports = authMiddleware;
