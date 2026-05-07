const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarDoctorSchedule {
  constructor(scheduleRepo) {
    this.scheduleRepo = scheduleRepo;
  }

  async ejecutar(id) {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) throw new NotFoundError("Horario no encontrado");
    await this.scheduleRepo.softDelete(id);
  }
}

module.exports = EliminarDoctorSchedule;