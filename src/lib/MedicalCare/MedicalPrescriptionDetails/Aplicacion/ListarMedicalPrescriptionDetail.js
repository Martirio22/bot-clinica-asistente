class ListarMedicalPrescriptionDetail {
  constructor(detailRepo) {
    this.detailRepo = detailRepo;
  }

 async ejecutar() {
    return await this.detailRepo.findAll(); 
  }
}

module.exports = ListarMedicalPrescriptionDetail;