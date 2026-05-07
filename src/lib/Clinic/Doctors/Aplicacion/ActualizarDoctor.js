const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class ActualizarDoctor {
  constructor(doctorRepository, userRepository, specialtyRepository) {
    this.doctorRepository = doctorRepository;
    this.userRepository = userRepository;
    this.specialtyRepository = specialtyRepository;
  }

  async ejecutar(id, data) {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundError("Médico no encontrado");
    }

    if (data.userId) {
      const user = await this.userRepository.findById(data.userId);
      if (!user) {
        throw new NotFoundError("Usuario no encontrado");
      }
      if (!user.isActive) {
        throw new ConflictError("El usuario seleccionado está inactivo");
      }

      const tieneRolMedico = user.roles && user.roles.some(role => role.code === "MEDICO");
  if (!tieneRolMedico) {
    throw new ConflictError("El nuevo usuario asignado no tiene el rol de MÉDICO");
  }
  
      const existingDoctor = await this.doctorRepository.findByUserId(data.userId);
      if (existingDoctor && existingDoctor.id !== id) {
        throw new ConflictError("El usuario ya pertenece a otro médico");
      }
    }

    if (data.specialtyId) {
      const specialty = await this.specialtyRepository.findById(data.specialtyId);
      if (!specialty) {
        throw new NotFoundError("Especialidad no encontrada");
      }
      if (!specialty.isActive) {
        throw new ConflictError("La especialidad seleccionada está inactiva");
      }
    }

    return await this.doctorRepository.update(id, {
      userId: data.userId ?? doctor.userId,
      specialtyId: data.specialtyId ?? doctor.specialtyId,
      professionalRegistry: data.professionalRegistry ?? doctor.professionalRegistry,
      appointmentDurationMinutes: data.appointmentDurationMinutes ?? doctor.appointmentDurationMinutes,
      attendsWhatsApp: data.attendsWhatsApp ?? doctor.attendsWhatsApp,
      isActive: data.isActive ?? doctor.isActive
    });
  }
}

module.exports = ActualizarDoctor;