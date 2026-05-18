const MessageType = require("../Dominio/Entidades/MessageType");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearMessageType {
  constructor(messageTypeRepository) {
    this.messageTypeRepository = messageTypeRepository;
  }

  async ejecutar(data) {
    const nuevoTipo = new MessageType({ ...data, isActive: true });
    
    const tipoExistente = await this.messageTypeRepository.findByCode(nuevoTipo.code);
    if (tipoExistente) {
      throw new ConflictError(`El código de tipo de mensaje '${nuevoTipo.code}' ya existe.`);
    }

    return await this.messageTypeRepository.create(nuevoTipo);
  }
}

module.exports = CrearMessageType;