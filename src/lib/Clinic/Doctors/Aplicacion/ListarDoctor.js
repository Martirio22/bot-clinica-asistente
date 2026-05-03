class ListarDoctor {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async ejecutar() {
    return await this.doctorRepository.findAll();
  }
}

module.exports = ListarDoctor;