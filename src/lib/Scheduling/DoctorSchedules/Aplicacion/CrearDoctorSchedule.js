const DoctorSchedule = require("../Dominio/Entidades/DoctorSchedule");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearDoctorSchedule {
  constructor(scheduleRepo, doctorRepo, branchRepo, officeRepo) {
    this.scheduleRepo = scheduleRepo;
    this.doctorRepo = doctorRepo;
    this.branchRepo = branchRepo;
    this.officeRepo = officeRepo;
  }

  async ejecutar(data) {
    const nuevoHorario = new DoctorSchedule({ ...data, isActive: true });

    const horarioExistente = await this.scheduleRepo.findCollidingSchedule(
    nuevoHorario.doctorId,
    nuevoHorario.dayOfWeek,
    nuevoHorario.startTime,
    nuevoHorario.endTime
  );

  if (horarioExistente) {
    throw new ConflictError(
      `El médico ya tiene un horario asignado el día ${nuevoHorario.dayOfWeek} que se cruza con este rango (${horarioExistente.startTime} - ${horarioExistente.endTime})`
    );
  }
    const doctor = await this.doctorRepo.findById(nuevoHorario.doctorId);
    if (!doctor) throw new NotFoundError("Médico no encontrado");
    if (!doctor.isActive) throw new ConflictError("El médico seleccionado está inactivo");

    const branch = await this.branchRepo.findById(nuevoHorario.branchId);
    if (!branch) throw new NotFoundError("Sucursal no encontrada");
    if (!branch.isActive) throw new ConflictError("La sucursal seleccionada está inactiva");

    if (nuevoHorario.officeId) {
      const office = await this.officeRepo.findById(nuevoHorario.officeId);
      if (!office) throw new NotFoundError("Consultorio no encontrado");
      if (!office.isActive) throw new ConflictError("El consultorio seleccionado está inactivo");
      
      if (office.branchId !== nuevoHorario.branchId) {
        throw new ConflictError("El consultorio no pertenece a la sucursal seleccionada");
      }
    }

    return await this.scheduleRepo.create(nuevoHorario);
  }
}

module.exports = CrearDoctorSchedule;