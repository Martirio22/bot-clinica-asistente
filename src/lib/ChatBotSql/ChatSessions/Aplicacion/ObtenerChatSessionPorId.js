const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerChatSessionPorId {
  constructor(chatSessionRepository) {
    this.chatSessionRepository = chatSessionRepository;
  }

  async ejecutar(id) {
    const session = await this.chatSessionRepository.findById(id);
    if (!session) throw new NotFoundError("Sesión de chat no encontrada");
    return session;
  }
}

module.exports = ObtenerChatSessionPorId;