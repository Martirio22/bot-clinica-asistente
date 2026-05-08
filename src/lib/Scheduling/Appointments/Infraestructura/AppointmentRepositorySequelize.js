const { Op } = require("sequelize");
const Appointment = require("../Dominio/Entidades/Appointment");
const AppointmentModel = require("./AppointmentModel");

// Importación de Modelos para los Includes
const PatientModel = require("../../../Clinic/Patients/Infraestructura/PatientModel");
const DoctorModel = require("../../../Clinic/Doctors/Infraestructura/DoctorModel");
const SpecialtyModel = require("../../../Clinic/Specialties/Infraestructura/SpecialtyModel");
const BranchModel = require("../../../Clinic/Branches/Infraestructura/BranchModel");
const OfficeModel = require("../../../Clinic/Offices/Infraestructura/OfficeModel");
const AppointmentStatusModel = require("../../AppointmentStatus/Infraestructura/AppointmentStatusModel");
const UserModel = require("../../../Security/Users/Infraestructura/UserModel");

class AppointmentRepositorySequelize {
  
  // Mapeo de persistencia a dominio con sus 7 relaciones
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new Appointment({
      ...plain,
      patient: plain.patient || null,
      doctor: plain.doctor || null,
      specialty: plain.specialty || null,
      branch: plain.branch || null,
      office: plain.office || null,
      status: plain.status || null,
      creatorUser: plain.creatorUser || null
    });
  }

  async create(appointment) {
    const created = await AppointmentModel.create(appointment);
    return this.findById(created.id);
  }

  async findById(id) {
    const data = await AppointmentModel.findByPk(id, {
      include: [
        { model: PatientModel, as: "patient" },
        { model: DoctorModel, as: "doctor" },
        { model: SpecialtyModel, as: "specialty" },
        { model: BranchModel, as: "branch" },
        { model: OfficeModel, as: "office" },
        { model: AppointmentStatusModel, as: "status" },
        { model: UserModel, as: "creatorUser" }
      ]
    });
    return data ? this.toDomain(data) : null;
  }

  async findAll(filters = {}) {
  const { doctorId, patientId, date, statusId } = filters;
  const where = { isActive: true };

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
    include: [
      { model: PatientModel, as: "patient" },
      { model: DoctorModel, as: "doctor" },
      { model: SpecialtyModel, as: "specialty" },
      { model: BranchModel, as: "branch" },
      { model: OfficeModel, as: "office" },
      { model: AppointmentStatusModel, as: "status" },
      { model: UserModel, as: "creatorUser" }
    ],
    order: [["startDate", "ASC"]] 
  });
  
  return data.map(item => this.toDomain(item));
}

  async update(id, data) {
    await AppointmentModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async _getActiveStatusIds() {
    const activeStatuses = await AppointmentStatusModel.findAll({
      where: { 
        code: { [Op.in]: ['RESERVADA', 'CONFIRMADA', 'EN_ESPERA'] }
      }
    });
    return activeStatuses.map(s => s.id);
  }

  async findOverlap(doctorId, startDate, endDate) {
    const activeStatusIds = await this._getActiveStatusIds();
    const overlap = await AppointmentModel.findOne({
      where: {
        doctorId,
        statusId: { [Op.in]: activeStatusIds },
        [Op.and]: [
          { startDate: { [Op.lt]: endDate } },
          { endDate: { [Op.gt]: startDate } }
        ]
      }
    });
    return overlap ? this.toDomain(overlap) : null;
  }

  async findDuplicatePatientAppointment(patientId, specialtyId, date) {
    const activeStatusIds = await this._getActiveStatusIds();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const duplicate = await AppointmentModel.findOne({
      where: {
        patientId,
        specialtyId,
        statusId: { [Op.in]: activeStatusIds },
        startDate: { [Op.between]: [startOfDay, endOfDay] }
      }
    });
    return duplicate ? this.toDomain(duplicate) : null;
  }

  async softDelete(id) {
  return await AppointmentModel.update({ isActive: false }, { where: { id } }
  );
}
}

module.exports = AppointmentRepositorySequelize;