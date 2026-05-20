class WebhookLog {
  constructor({ id, provider, endpoint, httpMethod, statusCode, responseTimeMs, payloadCrudo = null, error = null, createdAt = null }) {
    if (!provider) throw new Error("provider requerido");
    if (!endpoint) throw new Error("endpoint requerido");
    if (!httpMethod) throw new Error("httpMethod requerido");
    if (!statusCode) throw new Error("statusCode requerido");

    this.id = id;
    this.provider = provider;
    this.endpoint = endpoint;
    this.httpMethod = httpMethod;
    this.statusCode = statusCode;
    this.responseTimeMs = responseTimeMs;
    this.payloadCrudo = payloadCrudo;
    this.error = error;
    this.createdAt = createdAt;
  }
}

module.exports = WebhookLog;