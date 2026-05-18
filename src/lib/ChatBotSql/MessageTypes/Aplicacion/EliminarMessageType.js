const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarMessageType {
  constructor(messageTypeRepository) {
    this.messageTypeRepository = messageTypeRepository;
  }

  async ejecutar(id) {
    const messageType = await this.messageTypeRepository.findById(id);
    if (!messageType) throw new NotFoundError("Tipo de mensaje no encontrado");

    await this.messageTypeRepository.softDelete(id);
  }
}

module.exports = EliminarMessageType;