const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");
const ValidationError = require("../../../../shared/errors/ValidationError");

class ActualizarDoctorSchedule {
  constructor(scheduleRepo, branchRepo, officeRepo) {
    this.scheduleRepo = scheduleRepo;
    this.branchRepo = branchRepo;
    this.officeRepo = officeRepo;
  }

  async ejecutar(id, data) {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) throw new NotFoundError("Horario no encontrado");
    const updatedData = {
      doctorId: schedule.doctorId,
      branchId: data.branchId ?? schedule.branchId,
      officeId: data.officeId ?? schedule.officeId,
      dayOfWeek: data.dayOfWeek ?? schedule.dayOfWeek,
      startTime: data.startTime ?? schedule.startTime,
      endTime: data.endTime ?? schedule.endTime,
      isActive: data.isActive ?? schedule.isActive
    };

    if (data.branchId && data.branchId !== schedule.branchId) {
      const branch = await this.branchRepo.findById(data.branchId);
      if (!branch || !branch.isActive) throw new NotFoundError("La nueva sucursal es inválida o está inactiva");
    }
    if (data.officeId || data.branchId) {
      const office = await this.officeRepo.findById(updatedData.officeId);
      if (!office || !office.isActive) throw new NotFoundError("El consultorio seleccionado es inválido o está inactivo");

      if (office.branchId !== updatedData.branchId) {
        throw new ValidationError("El consultorio no pertenece a la sucursal seleccionada");
      }
    }
    const horarioExistente = await this.scheduleRepo.findCollidingSchedule(
      updatedData.doctorId,
      updatedData.dayOfWeek,
      updatedData.startTime,
      updatedData.endTime,
      id
    );
    if (horarioExistente) {throw new ConflictError(`Conflicto: El médico ya tiene otra asignación el día ${updatedData.dayOfWeek} en ese rango`);}
    const consultorioOcupado = await this.scheduleRepo.findOfficeOverlap(
      updatedData.officeId,
      updatedData.dayOfWeek,
      updatedData.startTime,
      updatedData.endTime,
      id 
    );
    if (consultorioOcupado) {throw new ConflictError("El consultorio ya está ocupado por otro médico en ese horario");}
    return await this.scheduleRepo.update(id, updatedData);
  }
}

module.exports = ActualizarDoctorSchedule;