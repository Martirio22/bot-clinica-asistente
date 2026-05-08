const { Op } = require("sequelize");
const ScheduleBlock = require("../Dominio/Entidades/ScheduleBlock");
const ScheduleBlockModel = require("./ScheduleBlockModel");
const DoctorModel = require("../../../Clinic/Doctors/Infraestructura/DoctorModel");
const ScheduleBlockTypeModel = require("../../ScheduleBlockType/Infraestructura/ScheduleBlockTypeModel");
const UserModel = require("../../../Security/Users/Infraestructura/UserModel");

class ScheduleBlockRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new ScheduleBlock({
      ...plain,
      doctor: plain.doctor || null,
      blockingType: plain.blockingType || null,
      user: plain.user || null
    });
  }

  async create(block) {
    const created = await ScheduleBlockModel.create(block);
    return this.toDomain(created);
  }

  async findById(id) {
    const data = await ScheduleBlockModel.findByPk(id, {
      include: [
        { model: DoctorModel, as: "doctor" },
        { model: ScheduleBlockTypeModel, as: "blockingType" },
        { model: UserModel, as: "user" }
      ]
    });
    return data ? this.toDomain(data) : null;
  }

  async findAllByDoctor(doctorId) {
    const data = await ScheduleBlockModel.findAll({
      where: { doctorId, isActive: true },
      include: [{ model: ScheduleBlockTypeModel, as: "blockingType" },
        { model: UserModel, as: "user" }
      ],
      order: [["startDate", "ASC"]]
    });
    return data.map(b => this.toDomain(b));
  }

  async findAll() {
    const data = await ScheduleBlockModel.findAll({
      where: { isActive: true },
      include: [
        { model: DoctorModel, as: "doctor" },
        { model: ScheduleBlockTypeModel, as: "blockingType" },
        { model: UserModel, as: "user" }
      ],
      order: [["startDate", "DESC"]]
    });
    return data.map(b => this.toDomain(b));
  }

  async update(id, data) {
    await ScheduleBlockModel.update(data, { where: { id } });
    return await this.findById(id);
  }
  
  async findOverlap(doctorId, startDate, endDate) {
    return await ScheduleBlockModel.findOne({
      where: {
        doctorId,
        isActive: true,
        [Op.and]: [
          { startDate: { [Op.lt]: endDate } },
          { endDate: { [Op.gt]: startDate } }
        ]
      }
    });
  }

  async softDelete(id) {
    await ScheduleBlockModel.update({ isActive: false }, { where: { id } });
  }
}

module.exports = ScheduleBlockRepositorySequelize;