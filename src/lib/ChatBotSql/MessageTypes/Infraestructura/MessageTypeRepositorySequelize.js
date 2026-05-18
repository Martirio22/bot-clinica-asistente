const MessageType = require("../Dominio/Entidades/MessageType");
const MessageTypeModel = require("./MessageTypeModel");

class MessageTypeRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new MessageType({
      id: plain.id,
      code: plain.code,
      name: plain.name,
      description: plain.description,
      isActive: plain.isActive
    });
  }

  async create(type) {
    const created = await MessageTypeModel.create({
      code: type.code,
      name: type.name,
      description: type.description,
      isActive: type.isActive
    });
    return this.toDomain(created);
  }

  async findById(id) {
    const type = await MessageTypeModel.findByPk(id);
    return type ? this.toDomain(type) : null;
  }

  async findAll() {
    const types = await MessageTypeModel.findAll({
      where: { isActive: true }
    });
    return types.map(t => this.toDomain(t));
  }

  async update(id, data) {
    await MessageTypeModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await MessageTypeModel.update({ isActive: false }, { where: { id } });
  }

  async findByCode(code) {
    if (!code) return null;
    const type = await MessageTypeModel.findOne({
      where: { code: code.toUpperCase() }
    });
    return type ? this.toDomain(type) : null;
  }
}

module.exports = MessageTypeRepositorySequelize;