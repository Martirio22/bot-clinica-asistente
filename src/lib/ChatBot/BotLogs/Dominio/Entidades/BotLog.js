class BotLog {
  constructor({ id, level, module, message, chatSessionId = null, error = null, createdAt = null }) {
    if (!level) throw new Error("level requerido");
    if (!module) throw new Error("module requerido");
    if (!message) throw new Error("message requerido");

    this.id = id;
    this.level = level;
    this.module = module;
    this.message = message;
    this.chatSessionId = chatSessionId;
    this.error = error;
    this.createdAt = createdAt;
  }
}

module.exports = BotLog;