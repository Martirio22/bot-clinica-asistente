const BotIntent = require("../Dominio/Entidades/BotIntent");
const BotIntentModel = require("./BotIntentModel");

class BotIntentRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new BotIntent({
      id: plain.id,
      code: plain.code,
      name: plain.name,
      description: plain.description,
      isActive: plain.isActive
    });
  }

  async create(intent) {
    const created = await BotIntentModel.create({
      code: intent.code,
      name: intent.name,
      description: intent.description,
      isActive: intent.isActive
    });
    return this.toDomain(created);
  }

  async findById(id) {
    const intent = await BotIntentModel.findByPk(id);
    return intent ? this.toDomain(intent) : null;
  }

  async findAll() {
    const intents = await BotIntentModel.findAll({
      where: { isActive: true }
    });
    return intents.map(i => this.toDomain(i));
  }

  async update(id, data) {
    await BotIntentModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await BotIntentModel.update({ isActive: false }, { where: { id } });
  }

  async findByCode(code) {
    if (!code) return null;
    const intent = await BotIntentModel.findOne({
      where: { code: code.toUpperCase() }
    });
    return intent ? this.toDomain(intent) : null;
  }
}

module.exports = BotIntentRepositorySequelize;