const ScheduleBlockType = require("../Dominio/Entidades/ScheduleBlockType");
const ScheduleBlockTypeModel = require("./ScheduleBlockTypeModel");

class SBTRepositorySequelize {

  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;

    return new ScheduleBlockType({
      id: plain.id,
      code: plain.code,
      name: plain.name,
      description: plain.description,
      isActive: plain.isActive
    });
  }

  async create(sbt) {
    const created = await ScheduleBlockTypeModel.create({
      code: sbt.code,
      name: sbt.name,
      description: sbt.description,
      isActive: sbt.isActive
    });

    return this.toDomain(created);
  }

  async findById(id) {
    const sbt = await ScheduleBlockTypeModel.findByPk(id);
    return sbt ? this.toDomain(sbt) : null;
  }

  async findAll() {
    const sbt = await ScheduleBlockTypeModel.findAll({
      order: [["createdAt", "DESC"]]
    });

    return sbt.map(x => this.toDomain(x));
  }

  async update(id, data) {
    await ScheduleBlockTypeModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await ScheduleBlockTypeModel.update({ isActive: false }, { where: { id } });
  }

  async findByCode(code) {
    const sbt = await ScheduleBlockTypeModel.findOne({ where: { code } });
    return sbt ? this.toDomain(sbt) : null;
  }
}

module.exports = SBTRepositorySequelize;