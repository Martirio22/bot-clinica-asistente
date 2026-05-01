const AppError = require("./AppError");
class ValidationError extends AppError {
  constructor(message = "Datos inválidos") { super(message, 400); }
}
module.exports = ValidationError;
