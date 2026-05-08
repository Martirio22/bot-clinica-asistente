const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class ActualizarDoctorSchedule {
  constructor(scheduleRepo, branchRepo, officeRepo) {
    this.scheduleRepo = scheduleRepo;
    this.branchRepo = branchRepo;
    this.officeRepo = officeRepo;
  }

  async ejecutar(id, data) {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) throw new NotFoundError("Horario no encontrado");

    const currentBranchId = String(schedule.branchId);
    const currentOfficeId = schedule.officeId ? String(schedule.officeId) : null;

    if (data.branchId && String(data.branchId) !== currentBranchId) {
      const branch = await this.branchRepo.findById(data.branchId);
      if (!branch || branch.isActive === false) {
        throw new ConflictError("Sucursal inválida o inactiva");
      }
    }

    if (data.officeId && String(data.officeId) !== currentOfficeId) {
      const office = await this.officeRepo.findById(data.officeId);
      
      if (!office || office.isActive === false) {
        throw new ConflictError("Consultorio inválido o inactivo");
      }

      const targetBranchId = data.branchId || schedule.branchId;
      if (String(office.branchId) !== String(targetBranchId)) {
        throw new ConflictError("El consultorio no pertenece a la sucursal seleccionada");
      }
    }

    return await this.scheduleRepo.update(id, {
      branchId: data.branchId ?? schedule.branchId,
      officeId: data.officeId ?? schedule.officeId,
      dayOfWeek: data.dayOfWeek ?? schedule.dayOfWeek,
      startTime: data.startTime ?? schedule.startTime,
      endTime: data.endTime ?? schedule.endTime,
      isActive: data.isActive ?? schedule.isActive
    });
  }
}

module.exports = ActualizarDoctorSchedule;