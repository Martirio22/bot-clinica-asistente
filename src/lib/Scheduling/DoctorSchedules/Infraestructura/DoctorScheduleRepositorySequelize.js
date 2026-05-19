const { Op } = require("sequelize");
const DoctorSchedule = require("../Dominio/Entidades/DoctorSchedule");
const DoctorScheduleModel = require("./DoctorScheduleModel");
const DoctorModel = require("../../../Clinic/Doctors/Infraestructura/DoctorModel");
const BranchModel = require("../../../Clinic/Branches/Infraestructura/BranchModel");
const OfficeModel = require("../../../Clinic/Offices/Infraestructura/OfficeModel");

class DoctorScheduleRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new DoctorSchedule({
      ...plain,
      doctor: plain.doctor || null,
      branch: plain.branch || null,
      office: plain.office || null
    });
  }

  async create(schedule) {
    const created = await DoctorScheduleModel.create(schedule);
    return this.toDomain(created);
  }

  async findAll() {
    const schedules = await DoctorScheduleModel.findAll({
      include: [
        { model: DoctorModel, as: "doctor" },
        { model: BranchModel, as: "branch" },
        { model: OfficeModel, as: "office" }
      ],
      order: [["dayOfWeek", "ASC"], ["startTime", "ASC"]]
    });
    return schedules.map(s => this.toDomain(s));
  }

  async findById(id) {
    const data = await DoctorScheduleModel.findByPk(id, {
      include: [
        { model: DoctorModel, as: "doctor" },
        { model: BranchModel, as: "branch" },
        { model: OfficeModel, as: "office" }
      ]
    });
    return data ? this.toDomain(data) : null;
  }

  async findAllByDoctor(doctorId) {
  const schedules = await DoctorScheduleModel.findAll({
    where: { doctorId },
    include: [
      { model: DoctorModel, as: "doctor" },
      { model: BranchModel, as: "branch" },
      { model: OfficeModel, as: "office" }
    ],
    order: [["dayOfWeek", "ASC"], ["startTime", "ASC"]]
  });
  
  return schedules.map(s => this.toDomain(s));
}

async findSchedule(doctorId, dayOfWeek, startDate, endDate) {
  const startTime = new Date(startDate).toTimeString().split(' ')[0];
  const endTime = new Date(endDate).toTimeString().split(' ')[0];

  return await DoctorScheduleModel.findOne({
    where: {
      doctorId,
      dayOfWeek,
      isActive: true,
      startTime: { [Op.lte]: startTime },
      endTime: { [Op.gte]: endTime }
    }
  });
}

  async update(id, data) {
    await DoctorScheduleModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await DoctorScheduleModel.update({ isActive: false }, { where: { id } });
  }

async findOfficeOverlap(officeId, dayOfWeek, startTime, endTime, excludeId = null) {
  const whereCondition = {officeId, dayOfWeek,isActive: true,
    [Op.or]: [{startTime: { [Op.lt]: endTime }, endTime: { [Op.gt]: startTime }}]
  };
  if (excludeId) {whereCondition.id = { [Op.ne]: excludeId };}
  return await DoctorScheduleModel.findOne({ where: whereCondition });
}

async findCollidingSchedule(doctorId, dayOfWeek, startTime, endTime, excludeId = null) {
  const whereCondition = {doctorId, dayOfWeek, isActive: true,
    [Op.or]: [ { startTime: { [Op.lt]: endTime }, endTime: { [Op.gt]: startTime } }]
  };
  if (excludeId) { whereCondition.id = { [Op.ne]: excludeId };}
  return await DoctorScheduleModel.findOne({ where: whereCondition });
}
}

module.exports = DoctorScheduleRepositorySequelize;