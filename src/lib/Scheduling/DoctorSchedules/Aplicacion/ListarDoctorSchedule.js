class ListarDoctorSchedule {
  constructor(scheduleRepo) {
    this.scheduleRepo = scheduleRepo;
  }

  async ejecutar(doctorId) {
    return doctorId 
      ? await this.scheduleRepo.findAllByDoctor(doctorId)
      : await this.scheduleRepo.findAll();
  }
}

module.exports = ListarDoctorSchedule;