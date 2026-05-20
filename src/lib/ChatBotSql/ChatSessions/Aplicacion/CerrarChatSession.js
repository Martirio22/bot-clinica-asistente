const NotFoundError = require("../../../../shared/errors/NotFoundError");

class CerrarChatSession {
  constructor(chatSessionRepository) {
    this.chatSessionRepo = chatSessionRepository;
  }

  async ejecutar(sessionId, datosCierre) {
    const sesion = await this.chatSessionRepo.findById(sessionId);
    if (!sesion) throw new NotFoundError("Sesión de chat no encontrada");

    const statusId = await this.chatSessionRepo.findStatusByCode('CERRADA');

    const updateData = {
      sessionStatusId: statusId,
      closeDate: new Date().toISOString(),
      closeReason: datosCierre.closeReason,
      conversationSummary: datosCierre.conversationSummary
    };

    return await this.chatSessionRepo.update(sessionId, updateData);
  }
}

module.exports = CerrarChatSession;