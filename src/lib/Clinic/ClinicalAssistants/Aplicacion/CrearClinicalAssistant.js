const ClinicalAssistant = require("../Dominio/Entidades/ClinicalAssistant");
const ConflictError = require("../../../../shared/errors/ConflictError");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
class CrearClinicalAssistant {
  constructor(caRepository, userRepository, doctorRepository) {
    this.caRepository = caRepository;
    this.userRepository = userRepository;
    this.doctorRepository = doctorRepository;
  }

  async ejecutar(data) {

    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new NotFoundError("El usuario no existe");
    }

    const existingAssistant = await this.caRepository.findByUserId(data.userId);
    if (existingAssistant) {
      throw new ConflictError("El usuario ya es asistente clínico");
    }

    const existingDoctor = await this.doctorRepository.findByUserId(data.userId);
    if (existingDoctor) {
      throw new ConflictError("El usuario ya es médico y no puede ser asistente");
    }

    return await this.caRepository.create(
      new ClinicalAssistant({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearClinicalAssistant;