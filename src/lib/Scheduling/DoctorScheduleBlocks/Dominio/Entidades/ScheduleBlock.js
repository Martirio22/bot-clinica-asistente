const ValidationError = require("../../../../../shared/errors/ValidationError");
class ScheduleBlock {
  constructor({
    id,
    doctorId,
    blockingTypeId,
    startDate,
    endDate,
    reason = null,
    registeredByUserId,
    isActive = true,
    doctor = null,
    blockingType = null,
    user = null
  }) {
    if (!doctorId) throw new ValidationError("Médico requerido");
    if (!blockingTypeId) throw new ValidationError("Tipo de bloqueo requerido");
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    if (isNaN(start.getTime())) throw new ValidationError("Fecha de inicio válida requerida");
    if (isNaN(end.getTime())) throw new ValidationError("Fecha de fin válida requerida");
    if (start >= end) throw new ValidationError("La fecha de inicio debe ser anterior a la de fin");
    if (!id && start < now.setSeconds(0, 0)) {
      throw new ValidationError("No se pueden registrar bloqueos en fechas o horas pasadas");
    }
    if (!registeredByUserId) throw new ValidationError("Usuario registrador requerido");

    this.id = id;
    this.doctorId = doctorId;
    this.blockingTypeId = blockingTypeId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.reason = reason;
    this.registeredByUserId = registeredByUserId;
    this.isActive = isActive;

    this.doctor = doctor;
    this.blockingType = blockingType;
    this.user = user;
  }
}

module.exports = ScheduleBlock;