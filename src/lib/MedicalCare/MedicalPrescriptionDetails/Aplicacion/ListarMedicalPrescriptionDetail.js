class ListarMedicalPrescriptionDetail {
  constructor(detailRepo) {
    this.detailRepo = detailRepo;
  }

  async ejecutar(userIdFromToken) {
    return await this.detailRepo.findAllByDoctor(userIdFromToken);
  }
}

module.exports = ListarMedicalPrescriptionDetail;