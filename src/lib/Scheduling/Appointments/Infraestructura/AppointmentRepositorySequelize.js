const { Op } = require("sequelize");
const Appointment = require("../Dominio/Entidades/Appointment");
const AppointmentModel = require("./AppointmentModel");

const PatientModel = require("../../../Clinic/Patients/Infraestructura/PatientModel");
const DoctorModel = require("../../../Clinic/Doctors/Infraestructura/DoctorModel");
const SpecialtyModel = require("../../../Clinic/Specialties/Infraestructura/SpecialtyModel");
const BranchModel = require("../../../Clinic/Branches/Infraestructura/BranchModel");
const OfficeModel = require("../../../Clinic/Offices/Infraestructura/OfficeModel");
const AppointmentStatusModel = require("../../AppointmentStatus/Infraestructura/AppointmentStatusModel");
const UserModel = require("../../../Security/Users/Infraestructura/UserModel");

const FULL_INCLUDE = [
  { model: PatientModel, as: "patient" },
  { model: DoctorModel, as: "doctor" },
  { model: SpecialtyModel, as: "specialty" },
  { model: BranchModel, as: "branch" },
  { model: OfficeModel, as: "office" },
  { model: AppointmentStatusModel, as: "status" },
  { model: UserModel, as: "creatorUser" }
];

class AppointmentRepositorySequelize {
  
  toDomain(model) {
    if (!model) return null;
    const plain = model.toJSON ? model.toJSON() : model;
    return new Appointment(plain);
  }

  async create(appointment) {
    const created = await AppointmentModel.create(appointment);
    return this.findById(created.id);
  }

  async update(id, data) {
    await AppointmentModel.update(data, { where: { id } });
    return this.findById(id);
  }

  async updateStatus(appointmentId, statusId) {
    return await AppointmentModel.update({ statusId }, { where: { id: appointmentId } });
  }

  async softDelete(id) { return await AppointmentModel.update({ isActive: false }, { where: { id } }); }

  async softDeleteWithStatus(id, statusId) {
    return await AppointmentModel.update(
      { isActive: false, statusId: statusId }, 
      { where: { id } }
    );
  }

  async findById(id) {
    const data = await AppointmentModel.findByPk(id, { include: FULL_INCLUDE });
    return this.toDomain(data);
  }

  async findStatusByCode(code) {
    const status = await AppointmentStatusModel.findOne({ where: { code } });
    return status ? status.id : null;
  }

  async findAll(filters = {}) {
    const { doctorId, patientId, date, statusId, isActive } = filters;
    const where = {};

    if (isActive !== undefined) where.isActive = isActive;
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (statusId) where.statusId = statusId;

    if (date) {
      where.startDate = {
        [Op.between]: [
          `${date}T00:00:00.000-05:00`,
          `${date}T23:59:59.999-05:00`
        ]
      };
    }

    const data = await AppointmentModel.findAll({
      where,
      include: FULL_INCLUDE,
      order: [["startDate", "ASC"]] 
    });
    
    return data.map(item => this.toDomain(item));
  }

  async findOverlap(doctorId, startDate, endDate, excludeId = null) {
    const inactiveStatuses = await this._getInactiveStatusIds();
    
    const where = {
      doctorId,
      isActive: true,
      statusId: { [Op.notIn]: inactiveStatuses },
      [Op.and]: [
        { startDate: { [Op.lt]: endDate } },
        { endDate: { [Op.gt]: startDate } }
      ]
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const overlap = await AppointmentModel.findOne({ where });
    return this.toDomain(overlap);
  }

  async findDuplicatePatientAppointment(patientId, specialtyId, date) {
    const inactiveStatuses = await this._getInactiveStatusIds();
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const duplicate = await AppointmentModel.findOne({
      where: {
        patientId,
        specialtyId,
        statusId: { [Op.notIn]: inactiveStatuses },
        startDate: { [Op.between]: [startOfDay, endOfDay] }
      }
    });
    return this.toDomain(duplicate);
  }

  async _getInactiveStatusIds() {
    const inactive = await AppointmentStatusModel.findAll({
      where: { 
        code: { [Op.in]: ['CANCELADA', 'REPROGRAMADA', 'EXPIRADA'] }
      }
    });
    return inactive.map(s => s.id);
  }
}

module.exports = AppointmentRepositorySequelize;