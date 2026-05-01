const WhatsappRawEventModel = require("./WhatsappRawEventModel");
class WhatsappRawEventRepository {
  async save(data) { return await WhatsappRawEventModel.create(data); }
}
module.exports = WhatsappRawEventRepository;
