class ListarPatient {
    constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  async ejecutar() {
    return await this.patientRepository.findAll();
  }
}

module.exports = ListarPatient;