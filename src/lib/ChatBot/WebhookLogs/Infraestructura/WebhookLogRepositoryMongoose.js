const WebhookLog = require("../Dominio/Entidades/WebhookLog");
const WebhookLogModel = require("./WebhookLogModel");

class WebhookLogRepositoryMongoose {
  toDomain(doc) {
    const p = doc.toJSON ? doc.toJSON() : doc;
    return new WebhookLog({
      id: p._id.toString(),
      provider: p.provider,
      endpoint: p.endpoint,
      httpMethod: p.httpMethod,
      statusCode: p.statusCode,
      responseTimeMs: p.responseTimeMs,
      payloadCrudo: p.payloadCrudo,
      error: p.error,
      createdAt: p.createdAt
    });
  }

  async save(log) {
    const doc = await WebhookLogModel.create({
      provider: log.provider,
      endpoint: log.endpoint,
      httpMethod: log.httpMethod,
      statusCode: log.statusCode,
      responseTimeMs: log.responseTimeMs,
      payloadCrudo: log.payloadCrudo,
      error: log.error
    });
    return this.toDomain(doc);
  }
}

module.exports = WebhookLogRepositoryMongoose;