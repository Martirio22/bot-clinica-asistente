const ValidationError = require("../../../../../shared/errors/ValidationError");

class Appointment {
  constructor({
    id,
    patientId,
    doctorId,
    specialtyId,
    branchId,
    officeId = null,
    statusId,
    startDate,
    endDate,
    reason = null,
    origin = 'WHATSAPP',
    createdByUserId = null,
    isCreatedByBot = false,
    observation = null,
    isActive = true,

    patient = null,
    doctor = null,
    specialty = null,
    branch = null,
    office = null,
    status = null,
    creatorUser = null
  }) {
    if (!patientId) throw new ValidationError("El paciente es requerido");
    if (!doctorId) throw new ValidationError("El médico es requerido");
    if (!specialtyId) throw new ValidationError("La especialidad es requerida");
    if (!branchId) throw new ValidationError("La sucursal es requerida");
    if (!statusId) throw new ValidationError("El estado de la cita es requerido");

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime())) throw new ValidationError("Fecha de inicio inválida");
    if (isNaN(end.getTime())) throw new ValidationError("Fecha de fin inválida");
    if (start >= end) throw new ValidationError("La fecha de inicio debe ser anterior a la de fin");
    
    if (!id) {
      const MIN_HOURS_AHEAD = 24;
      const minAllowedDate = new Date(now.getTime() + MIN_HOURS_AHEAD * 60 * 60 * 1000);

      if (start < minAllowedDate) {
        throw new ValidationError(`Las citas deben programarse con al menos ${MIN_HOURS_AHEAD} horas de anticipación`);
      }
    }

    if (!isCreatedByBot && !createdByUserId && !id) {
      throw new ValidationError("Debe especificarse el usuario que registra la cita si no es creada por un Bot");
    }

    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.specialtyId = specialtyId;
    this.branchId = branchId;
    this.officeId = officeId;
    this.statusId = statusId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.reason = reason;
    this.origin = origin;
    this.createdByUserId = createdByUserId;
    this.isCreatedByBot = isCreatedByBot;
    this.observation = observation;
    this.isActive = isActive;

    this.patient = patient;
    this.doctor = doctor;
    this.specialty = specialty;
    this.branch = branch;
    this.office = office;
    this.status = status;
    this.creatorUser = creatorUser;
  }
}

module.exports = Appointment;