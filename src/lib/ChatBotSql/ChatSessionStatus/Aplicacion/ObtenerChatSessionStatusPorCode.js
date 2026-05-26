const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerChatSessionStatusPorCode {
  constructor(statusRepository) {
    this.statusRepository = statusRepository;
  }

  async ejecutar(code) {
    const status = await this.statusRepository.findByCode(code);
    if (!status) throw new NotFoundError(`Estado de sesión con código '${code}' no encontrado`);
    return status;
  }
}

module.exports = ObtenerChatSessionStatusPorCode;