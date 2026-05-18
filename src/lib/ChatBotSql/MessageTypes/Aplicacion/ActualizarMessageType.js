const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarMessageType {
  constructor(messageTypeRepository) {
    this.messageTypeRepository = messageTypeRepository;
  }

  async ejecutar(id, data) {
    const messageType = await this.messageTypeRepository.findById(id);
    if (!messageType || !messageType.isActive) throw new NotFoundError("Tipo de mensaje no encontrado");

    return await this.messageTypeRepository.update(id, {
      code: data.code ? data.code.trim().toUpperCase() : messageType.code,
      name: data.name ?? messageType.name,
      description: data.description !== undefined ? data.description : messageType.description,
      isActive: data.isActive ?? messageType.isActive
    });
  }
}

module.exports = ActualizarMessageType;