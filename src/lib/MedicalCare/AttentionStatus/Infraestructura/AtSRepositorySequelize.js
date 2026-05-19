const AttentionStatus = require("../Dominio/Entidades/AttentionStatus");
const AttentionStatusModel = require("./AttentionStatusModel");

class AtSRepositorySequelize {

  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;

    return new AttentionStatus({
      id: plain.id,
      code: plain.code,
      name: plain.name,
      description: plain.description,
      isActive: plain.isActive
    });
  }

  async create(ats) {
    const created = await AttentionStatusModel.create({
      code: ats.code,
      name: ats.name,
      description: ats.description,
      isActive: ats.isActive
    });

    return this.toDomain(created);
  }

  async findById(id) {
    const ats = await AttentionStatusModel.findByPk(id);
    return ats ? this.toDomain(ats) : null;
  }

  async findAll() {
    const ats = await AttentionStatusModel.findAll({
      order: [["createdAt", "DESC"]]
    });

    return ats.map(x => this.toDomain(x));
  }

  async update(id, data) {
    await AttentionStatusModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await AttentionStatusModel.update( { isActive: false }, { where: { id } } );
  }

  async findByCode(code) {
    const ats = await AttentionStatusModel.findOne({ where: { code: code.toUpperCase() } });
    return ats ? this.toDomain(ats) : null;
  }
}

module.exports = AtSRepositorySequelize;