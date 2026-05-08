const Doctor = require("../Dominio/Entidades/Doctor");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearDoctor {
  constructor(doctorRepository, userRepository, specialtyRepository) {
    this.doctorRepository = doctorRepository;
    this.userRepository = userRepository;
    this.specialtyRepository = specialtyRepository;
  }

  async ejecutar(data) {
  const nuevoDoctor = new Doctor({ ...data, isActive: true });

  const user = await this.userRepository.findById(nuevoDoctor.userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");
  if (!user.isActive) throw new ConflictError("El usuario está inactivo");

  const tieneRolMedico = user.roles && user.roles.some(role => role.code === "MEDICO");
  if (!tieneRolMedico) {
    throw new ConflictError("El usuario seleccionado no tiene el rol de MÉDICO asignado");
  }

  const specialty = await this.specialtyRepository.findById(nuevoDoctor.specialtyId);
  if (!specialty) throw new NotFoundError("Especialidad no encontrada");
  if (!specialty.isActive) throw new ConflictError("La especialidad está inactiva");

  if (await this.doctorRepository.findByUserId(nuevoDoctor.userId)) {
    throw new ConflictError("El usuario ya está asignado a un médico");
  }

  return await this.doctorRepository.create(nuevoDoctor);
}
}

module.exports = CrearDoctor;