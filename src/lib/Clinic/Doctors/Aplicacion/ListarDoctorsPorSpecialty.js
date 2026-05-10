class ListarDoctorsPorSpecialty {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async ejecutar(specialtyId) {
    if (!specialtyId) throw new Error("El ID de la especialidad es obligatorio");
    return await this.doctorRepository.findBySpecialty(specialtyId);
  }
}

module.exports = ListarDoctorsPorSpecialty;