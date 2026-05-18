const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerMessageTypePorCode {
  constructor(messageTypeRepository) {
    this.messageTypeRepository = messageTypeRepository;
  }

  async ejecutar(code) {
    const messageType = await this.messageTypeRepository.findByCode(code);
    if (!messageType || !messageType.isActive) throw new NotFoundError(`Tipo de mensaje con código '${code}' no encontrado`);
    return messageType;
  }
}

module.exports = ObtenerMessageTypePorCode;