class ListarScheduleBlockType {
  constructor(sbtRepository) {
    this.sbtRepository = sbtRepository;
  }

  async ejecutar() {
    return await this.sbtRepository.findAll();
  }
}

module.exports = ListarScheduleBlockType;