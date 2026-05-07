class DoctorSchedule {
  constructor({
    id,
    doctorId,
    branchId,
    officeId = null,
    dayOfWeek,
    startTime,
    endTime,
    isActive = true,
    doctor = null,
    branch = null,
    office = null
  }) {
    if (!doctorId) throw new Error("médico requerido");
    if (!branchId) throw new Error("sucursal requerida");
    if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) throw new Error("día de la semana inválido (1-7)");
    if (!startTime) throw new Error("hora de inicio requerida");
    if (!endTime) throw new Error("hora de fin requerida");
    if (startTime >= endTime) throw new Error("la hora de inicio debe ser menor a la hora de fin");

    this.id = id;
    this.doctorId = doctorId;
    this.branchId = branchId;
    this.officeId = officeId;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.isActive = isActive;

    this.doctor = doctor;
    this.branch = branch;
    this.office = office;
  }
}

module.exports = DoctorSchedule;