class AiBotEvent {
  constructor({
    id,
    chatSessionId,
    botIntentId = null,
    userText,
    aiResponse = null,
    suggestedSpecialtyId = null,
    confidenceLevel = null,
    requiresHuman = false,
    eventDate = null,
    isActive = true,

    // Relaciones anidadas de auditoría cargadas por FULL_INCLUDE
    chatSession = null,
    botIntent = null,
    suggestedSpecialty = null
  }) {
    // Validaciones de negocio obligatorias en Dominio
    if (!chatSessionId) throw new Error("La sesión de chat asociada es requerida");
    if (!userText || !userText.trim()) throw new Error("El texto ingresado por el usuario no puede estar vacío");

    this.id = id;
    this.chatSessionId = chatSessionId;
    this.botIntentId = botIntentId;
    this.userText = userText.trim();
    this.aiResponse = aiResponse ? aiResponse.trim() : null;
    this.suggestedSpecialtyId = suggestedSpecialtyId;
    this.confidenceLevel = confidenceLevel ? parseFloat(confidenceLevel) : null;
    this.requiresHuman = !!requiresHuman;
    this.eventDate = eventDate ? new Date(eventDate) : new Date();
    this.isActive = !!isActive;

    // Propiedades mapeadas de las asociaciones
    this.chatSession = chatSession;
    this.botIntent = botIntent;
    this.suggestedSpecialty = suggestedSpecialty;
  }
}

module.exports = AiBotEvent;