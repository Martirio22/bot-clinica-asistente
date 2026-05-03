const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarPatient {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  async ejecutar(id, data) {
    const p = await this.patientRepository.findById(id);
    if (!p) throw new NotFoundError("Paciente no encontrado");

    return await this.patientRepository.update(id, {
      identificationType: data.identificationType ?? p.identificationType,
      identification: data.identification ?? p.identification,
      firstName: data.firstName ?? p.firstName,
      lastName: data.lastName ?? p.lastName,
      birthDate: data.birthDate ?? p.birthDate,
      gender: data.gender ?? p.gender,
      email: data.email ?? p.email,
      whatsappPhone: data.whatsappPhone ?? p.whatsappPhone,
      address: data.address ?? p.address,
      isActive: data.isActive ?? p.isActive
    });
  }
}

module.exports = ActualizarPatient;