const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerDoctorSchedulePorId {
  constructor(scheduleRepo) {
    this.scheduleRepo = scheduleRepo;
  }

  async ejecutar(id) {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) throw new NotFoundError("Horario no encontrado");
    return schedule;
  }
}

module.exports = ObtenerDoctorSchedulePorId;