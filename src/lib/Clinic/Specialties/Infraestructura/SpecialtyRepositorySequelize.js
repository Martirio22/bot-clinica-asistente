const Specialty = require("../Dominio/Entidades/Specialty");
const SpecialtyModel = require("./SpecialtyModel");

class SpecialtyRepositorySequelize {

  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;

    return new Specialty({
      id: plain.id,
      code: plain.code,
      name: plain.name,
      description: plain.description,
      isActive: plain.isActive
    });
  }

  async create(entity) {
    const created = await SpecialtyModel.create({
      code: entity.code,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive
    });

    return this.toDomain(created);
  }

  async update(id, data) {
    await SpecialtyModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await SpecialtyModel.update({ isActive: false }, { where: { id } });
  }

  async findById(id) {
    const data = await SpecialtyModel.findByPk(id);
    return data ? this.toDomain(data) : null;
  }

  async findAll() {
    const data = await SpecialtyModel.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]]
    });

    return data.map(d => this.toDomain(d));
  }
async findByCode(code) {
  const data = await SpecialtyModel.findOne({ where: { code: code.toUpperCase()}
 });
  return data ? this.toDomain(data) : null;
}

}

module.exports = SpecialtyRepositorySequelize;