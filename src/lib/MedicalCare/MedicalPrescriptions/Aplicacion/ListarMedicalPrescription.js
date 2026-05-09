class ListarMedicalPrescriptions {
  constructor(prescriptionRepo) {
    this.prescriptionRepo = prescriptionRepo;
  }

  async ejecutar(userIdFromToken) {
    return await this.prescriptionRepo.findAllByDoctor(userIdFromToken);
  }
}

module.exports = ListarMedicalPrescriptions;