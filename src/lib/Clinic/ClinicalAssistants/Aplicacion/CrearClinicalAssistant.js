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
  const nuevoAsistente = new ClinicalAssistant({ ...data, isActive: true });

  const user = await this.userRepository.findById(nuevoAsistente.userId);
  if (!user) throw new NotFoundError("El usuario no existe");
  if (!user.isActive) throw new ConflictError("El usuario seleccionado está inactivo");

  const tieneRolAsistente = user.roles && user.roles.some(role => role.code === "ASISTENTE");
  if (!tieneRolAsistente) {
    throw new ConflictError("El usuario seleccionado no tiene el rol de ASISTENTE asignado");
  }

  if (await this.caRepository.findByUserId(nuevoAsistente.userId)) {
    throw new ConflictError("El usuario ya es asistente clínico");
  }

  return await this.caRepository.create(nuevoAsistente);
}
}

module.exports = CrearClinicalAssistant;