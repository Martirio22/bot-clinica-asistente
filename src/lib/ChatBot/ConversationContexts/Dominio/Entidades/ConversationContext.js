class ConversationContext {
  constructor({ id, chatSessionId, currentStep, lastIntent = null, temporaryData = {}, updatedAt = null }) {
    if (!chatSessionId) throw new Error("chatSessionId requerido");
    if (!currentStep) throw new Error("currentStep requerido");

    this.id = id;
    this.chatSessionId = chatSessionId;
    this.currentStep = currentStep;
    this.lastIntent = lastIntent;
    this.temporaryData = temporaryData;
    this.updatedAt = updatedAt;
  }
}

module.exports = ConversationContext;