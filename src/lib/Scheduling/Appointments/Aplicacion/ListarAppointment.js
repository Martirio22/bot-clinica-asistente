class ListarAppointment {
  constructor(appointmentRepo) {
    this.appointmentRepo = appointmentRepo;
  }

  async ejecutar(filtros = {}) {
    return await this.appointmentRepo.findAll(filtros);
  }
}

module.exports = ListarAppointment;