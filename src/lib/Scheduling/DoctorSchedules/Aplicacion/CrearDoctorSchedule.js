const DoctorSchedule = require("../Dominio/Entidades/DoctorSchedule");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class CrearDoctorSchedule {
  constructor(scheduleRepo, doctorRepo, branchRepo, officeRepo) {
    this.scheduleRepo = scheduleRepo;
    this.doctorRepo = doctorRepo;
    this.branchRepo = branchRepo;
    this.officeRepo = officeRepo;
  }

  async ejecutar(data) {
    const nuevoHorario = new DoctorSchedule({ ...data, isActive: true });

    const doctor = await this.doctorRepo.findById(nuevoHorario.doctorId);
    if (!doctor || !doctor.isActive) {throw new NotFoundError("Médico no encontrado o inactivo");}

    const branch = await this.branchRepo.findById(nuevoHorario.branchId);
    if (!branch || !branch.isActive) {throw new NotFoundError("Sucursal no encontrada o inactiva");}

    if (!nuevoHorario.officeId) {throw new ValidationError("Debe seleccionar un consultorio");}

    const office = await this.officeRepo.findById(nuevoHorario.officeId);
    if (!office || !office.isActive) {throw new NotFoundError("Consultorio no encontrado o inactivo");}

    if (office.branchId !== nuevoHorario.branchId) { throw new ValidationError("El consultorio seleccionado no pertenece a la sucursal elegida");}

    const horarioExistente = await this.scheduleRepo.findCollidingSchedule(
      nuevoHorario.doctorId,
      nuevoHorario.dayOfWeek,
      nuevoHorario.startTime,
      nuevoHorario.endTime
    );

    if (horarioExistente) {throw new ConflictError(`El médico ya tiene un horario el día ${nuevoHorario.dayOfWeek} entre ${horarioExistente.startTime} y ${horarioExistente.endTime}`);}

    const consultorioOcupado = await this.scheduleRepo.findOfficeOverlap(
      nuevoHorario.officeId,
      nuevoHorario.dayOfWeek,
      nuevoHorario.startTime,
      nuevoHorario.endTime
    );

    if (consultorioOcupado) {
      throw new ConflictError("El consultorio ya está ocupado por otro médico en ese rango de tiempo");
    }

    return await this.scheduleRepo.create(nuevoHorario);
  }
}

module.exports = CrearDoctorSchedule;