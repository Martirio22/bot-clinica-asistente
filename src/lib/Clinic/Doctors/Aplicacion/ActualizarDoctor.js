const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarDoctor {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async ejecutar(id, data) {
    const d = await this.doctorRepository.findById(id);
    if (!d) throw new NotFoundError("Médico no encontrado");

    return await this.doctorRepository.update(id, {
      specialtyId: data.specialtyId ?? d.specialtyId,
      professionalRegistry: data.professionalRegistry ?? d.professionalRegistry,
      appointmentDurationMinutes: data.appointmentDurationMinutes ?? d.appointmentDurationMinutes,
      attendsWhatsApp: data.attendsWhatsApp ?? d.attendsWhatsApp,
      isActive: data.isActive ?? d.isActive
    });
  }
}

module.exports = ActualizarDoctor;