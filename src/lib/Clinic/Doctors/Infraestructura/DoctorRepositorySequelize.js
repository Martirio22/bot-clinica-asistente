const DoctorModel = require("./DoctorModel");
const SecurityUserModel = require("../../../Security/Users/Infraestructura/UserModel");
const SpecialtyModel = require("../../Specialties/Infraestructura/SpecialtyModel");

class DoctorRepositorySequelize {

  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;

    return {
      id: plain.id,
      userId: plain.userId,
      specialtyId: plain.specialtyId,
      professionalRegistry: plain.professionalRegistry,
      appointmentDurationMinutes: plain.appointmentDurationMinutes,
      attendsWhatsApp: plain.attendsWhatsApp,
      isActive: plain.isActive,

      user: plain.user || null,
      specialty: plain.specialty || null
    };
  }

  async create(doctor) {
    const created = await DoctorModel.create({
      userId: doctor.userId,
      specialtyId: doctor.specialtyId,
      professionalRegistry: doctor.professionalRegistry,
      appointmentDurationMinutes: doctor.appointmentDurationMinutes,
      attendsWhatsApp: doctor.attendsWhatsApp,
      isActive: doctor.isActive
    });

    return this.toDomain(created);
  }

  async findById(id) {
    const doctor = await DoctorModel.findByPk(id, {
      include: [
        { model: SecurityUserModel, as: "user" },
        { model: SpecialtyModel, as: "specialty" }
      ]
    });

    return doctor ? this.toDomain(doctor) : null;
  }

  async findAll() {
    const doctors = await DoctorModel.findAll({
      include: [
        { model: SecurityUserModel, as: "user" },
        { model: SpecialtyModel, as: "specialty" }
      ],
      order: [["createdAt", "DESC"]]
    });

    return doctors.map(d => this.toDomain(d));
  }

  async update(id, data) {
    await DoctorModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await DoctorModel.update({ isActive: false }, { where: { id } });
  }
}

module.exports = DoctorRepositorySequelize;