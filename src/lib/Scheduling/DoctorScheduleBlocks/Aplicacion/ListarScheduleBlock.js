class ListarScheduleBlock {
  constructor(blockingRepo) {
    this.blockingRepo = blockingRepo;
  }

  async ejecutar(doctorId) {
    return doctorId 
      ? await this.blockingRepo.findAllByDoctor(doctorId)
      : await this.blockingRepo.findAll();
  }
}

module.exports = ListarScheduleBlock;