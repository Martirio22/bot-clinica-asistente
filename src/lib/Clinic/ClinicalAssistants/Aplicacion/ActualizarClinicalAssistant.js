const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarClinicalAssistant {
  constructor(caRepository) {
    this.caRepository = caRepository;
  }

  async ejecutar(id, data) {
    const ca = await this.caRepository.findById(id);
    if (!ca) throw new NotFoundError("Asistente clínico no encontrado");

    return await this.caRepository.update(id, {
      canManageChat: data.canManageChat ?? ca.canManageChat,
      canScheduleAppointments: data.canScheduleAppointments ?? ca.canScheduleAppointments,
      canAuthorizeCare: data.canAuthorizeCare ?? ca.canAuthorizeCare,
      isActive: data.isActive ?? ca.isActive
    });
  }
}

module.exports = ActualizarClinicalAssistant;