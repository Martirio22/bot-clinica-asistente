const WhatsappLine = require("../Dominio/Entidades/WhatsappLine");
const WhatsappLineModel = require("./WhatsappLineModel");

class WLRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new WhatsappLine({
      id: plain.id,
      name: plain.name,
      phone: plain.phone,
      description: plain.description,
      isActive: plain.isActive,
      isConnected: plain.isConnected,
      lastConnectionDate: plain.lastConnectionDate
    });
  }

  async create(line) {
    const created = await WhatsappLineModel.create({
      name: line.name,
      phone: line.phone,
      description: line.description,
      isActive: line.isActive,
      isConnected: line.isConnected,
      lastConnectionDate: line.lastConnectionDate
    });
    return this.toDomain(created);
  }

  async update(id, data) {
    await WhatsappLineModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await WhatsappLineModel.update({ isActive: false }, { where: { id } });
  }

  async findById(id) {
    const line = await WhatsappLineModel.findByPk(id);
    return line ? this.toDomain(line) : null;
  }

  async findAll() {
    const lines = await WhatsappLineModel.findAll({
    });
    return lines.map(l => this.toDomain(l));
  }

async findByPhone(phone) {
  const line = await WhatsappLineModel.findOne({
    where: { phone: phone }
  });
  
  return line ? this.toDomain(line) : null;
}
}

module.exports = WLRepositorySequelize;