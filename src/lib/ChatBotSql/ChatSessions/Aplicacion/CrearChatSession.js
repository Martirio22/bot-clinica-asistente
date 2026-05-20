const ChatSession = require("../Dominio/Entidades/ChatSession");

class CrearChatSession {
  constructor(chatSessionRepository) {
    this.chatSessionRepo = chatSessionRepository; 
  }

  async ejecutar(data) {
    const sessionStatusId = await this.chatSessionRepo.findStatusByCode('BOT_ACTIVO');
    if (!sessionStatusId) throw new Error("Estado 'BOT_ACTIVO' no configurado en el sistema");

    const nuevaSesion = new ChatSession({
      ...data,
      sessionStatusId,
      handledByBot: true,
      assignedAssistantId: null,
      startDate: new Date().toISOString()
    });

    return await this.chatSessionRepo.create(nuevaSesion);
  }
}

module.exports = CrearChatSession;