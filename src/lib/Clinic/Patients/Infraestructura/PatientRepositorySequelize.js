const Patient = require("../Dominio/Entidades/Patient");
const PatientModel = require("./PatientModel");
class PatientRepositorySequelize {
  toDomain(model) {
    const plain = model.toJSON ? model.toJSON() : model;
    return new Patient({
      id: plain.id,
      identificationType: plain.identificationType,
      identification: plain.identification,
      firstName: plain.firstName,
      lastName: plain.lastName,
      birthDate: plain.birthDate,
      gender: plain.gender,
      email: plain.email,
      whatsappPhone: plain.whatsappPhone,
      address: plain.address,
      isActive: plain.isActive
    });
  }
  async create(patient) {
    const created = await PatientModel.create({
      identificationType: patient.identificationType,
      identification: patient.identification,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      gender: patient.gender,
      email: patient.email,
      whatsappPhone: patient.whatsappPhone,
      address: patient.address,
      isActive: patient.isActive
    });
    return this.toDomain(created);
  }
  
  async findById(id) {
    if (!id) return null;
    const patient = await PatientModel.findByPk(id);
    return patient ? this.toDomain(patient) : null;
  }

  async findAll() {
    const patients = await PatientModel.findAll({
      order: [["createdAt", "DESC"]]
    });
    return patients.map(p => this.toDomain(p));
  }

  async update(id, data) {
    await PatientModel.update(data, { where: { id } });
    return await this.findById(id);
  }

  async softDelete(id) {
    await PatientModel.update({ isActive: false }, { where: { id } });
  }

  async findByEmail(email) {
    const patient = await PatientModel.findOne({ where: { email } });
    return patient ? this.toDomain(patient) : null;
  }

  async findByIdentification(identification) {
    const patient = await PatientModel.findOne({ where: { identification } });
    return patient ? this.toDomain(patient) : null;
  }

  async findByPhone(whatsappPhone) {
    const patient = await PatientModel.findOne({ 
      where: { whatsappPhone } 
    });
    return patient ? this.toDomain(patient) : null;
  }
}

module.exports = PatientRepositorySequelize;