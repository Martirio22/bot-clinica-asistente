const NotFoundError = require("../../../../shared/errors/NotFoundError");

class AsignarAsistenteHumano {
  constructor(chatSessionRepository) {
    this.chatSessionRepo = chatSessionRepository;
  }

  async ejecutar(sessionId, assistantId) {
    const sesion = await this.chatSessionRepo.findById(sessionId);
    if (!sesion) throw new NotFoundError("Sesión de chat no encontrada");

    const statusId = await this.chatSessionRepo.findStatusByCode('ATENCION_HUMANA');
    
    const updateData = {
      sessionStatusId: statusId,
      handledByBot: false,
      assignedAssistantId: assistantId,
      humanAssignmentDate: new Date().toISOString()
    };

    return await this.chatSessionRepo.update(sessionId, updateData);
  }
}

module.exports = AsignarAsistenteHumano;