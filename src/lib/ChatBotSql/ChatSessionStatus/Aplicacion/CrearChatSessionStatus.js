const ChatSessionStatus = require("../Dominio/Entidades/ChatSessionStatus");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearChatSessionStatus {
  constructor(statusRepository) {
    this.statusRepository = statusRepository;
  }

  async ejecutar(data) {
    const nuevoEstado = new ChatSessionStatus({ ...data, isActive: true });
    
    const estadoExistente = await this.statusRepository.findByCode(nuevoEstado.code);
    if (estadoExistente) {
      throw new ConflictError(`El código de estado de sesión '${nuevoEstado.code}' ya existe.`);
    }

    return await this.statusRepository.create(nuevoEstado);
  }
}

module.exports = CrearChatSessionStatus;