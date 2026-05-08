const ScheduleBlock = require("../Dominio/Entidades/ScheduleBlock");
const ConflictError = require("../../../../shared/errors/ConflictError");
const NotFoundError = require("../../../../shared/errors/NotFoundError");

class CrearScheduleBlock {
  constructor(blockingRepo, doctorRepo, blockTypeRepo, userRepo) {
    this.blockingRepo = blockingRepo;
    this.doctorRepo = doctorRepo;
    this.blockTypeRepo = blockTypeRepo;
    this.userRepo = userRepo;
  }

  async ejecutar(data) {
    const nuevoBloqueo = new ScheduleBlock({ ...data, isActive: true });

    const doctor = await this.doctorRepo.findById(nuevoBloqueo.doctorId);
    if (!doctor || !doctor.isActive) throw new ConflictError("Médico inválido o inactivo");

    const blockType = await this.blockTypeRepo.findById(nuevoBloqueo.blockingTypeId);
    if (!blockType || !blockType.isActive) throw new ConflictError("Tipo de bloqueo inválido o inactivo");

    const user = await this.userRepo.findById(nuevoBloqueo.registeredByUserId);
    if (!user) throw new NotFoundError("Usuario registrador no encontrado");

    const existeSolapamiento = await this.blockingRepo.findOverlap(
      nuevoBloqueo.doctorId,
      nuevoBloqueo.startDate,
      nuevoBloqueo.endDate
    );

    if (existeSolapamiento) {
      throw new ConflictError("El médico ya tiene un bloqueo en ese rango de fechas");
    }

    return await this.blockingRepo.create(nuevoBloqueo);
  }
}

module.exports = CrearScheduleBlock;