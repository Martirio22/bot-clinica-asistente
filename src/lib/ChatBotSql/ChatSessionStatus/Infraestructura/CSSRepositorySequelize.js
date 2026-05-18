const ChatSessionStatus = require("../Dominio/Entidades/ChatSessionStatus");
const ChatSessionStatusModel = require("./ChatSessionStatusModel");

class CSSRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new ChatSessionStatus({
      id: plain.id,
      code: plain.code,
      name: plain.name,
      description: plain.description,
      isActive: plain.isActive
    });
  }

  async create(status) {
    const created = await ChatSessionStatusModel.create({
      code: status.code,
      name: status.name,
      description: status.description,
      isActive: status.isActive
    });
    return this.toDomain(created);
  }

  async findById(id) {
    const status = await ChatSessionStatusModel.findByPk(id);
    return status ? this.toDomain(status) : null;
  }

  async findAll() {
    const statuses = await ChatSessionStatusModel.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]]
    });
    return statuses.map(s => this.toDomain(s));
  }

  async update(id, data) {
    await ChatSessionStatusModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await ChatSessionStatusModel.update({ isActive: false }, { where: { id } });
  }

  async findByCode(code) {
    if (!code) return null;
    const status = await ChatSessionStatusModel.findOne({
      where: { code: code.toUpperCase() }
    });
    return status ? this.toDomain(status) : null;
  }
}

module.exports = CSSRepositorySequelize;