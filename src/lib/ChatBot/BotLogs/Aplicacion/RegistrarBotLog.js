const BotLog = require("../Dominio/Entidades/BotLog");

class RegistrarBotLog {
  constructor(botLogRepository) {
    this.botLogRepository = botLogRepository;
  }

  async ejecutar(data) {
    const log = new BotLog(data);
    return await this.botLogRepository.save(log);
  }
}

module.exports = RegistrarBotLog;