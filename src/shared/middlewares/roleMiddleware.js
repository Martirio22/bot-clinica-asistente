const UnauthorizedError = require("../errors/UnauthorizedError");

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("No se encontró información de usuario"));
    }
    const userRoles = req.user.roles || []; 
    const hasPermission = userRoles.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
      return next(new UnauthorizedError(
        `Acceso denegado. Se requiere uno de estos roles: ${allowedRoles.join(", ")}`
      ));
    }

    next();
  };
};

module.exports = roleMiddleware;