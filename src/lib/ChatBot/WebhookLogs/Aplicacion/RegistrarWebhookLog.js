const WebhookLog = require("../Dominio/Entidades/WebhookLog");

class RegistrarWebhookLog {
  constructor(webhookLogRepository) {
    this.webhookLogRepository = webhookLogRepository;
  }

  async ejecutar(data) {
    const log = new WebhookLog(data);
    return await this.webhookLogRepository.save(log);
  }
}

module.exports = RegistrarWebhookLog;