class DoctorSchedule {
  constructor({
    id,
    doctorId,
    branchId,
    officeId = null,
    weekDay,
    startTime,
    endTime,
    isActive = true,

    doctor = null,
    branch = null,
    office = null
  }) {

    if (!doctorId) throw new Error("Doctor requerido");
    if (!branchId) throw new Error("Sucursal requerida");
    if (!weekDay) throw new Error("Día requerido");
    if (!startTime) throw new Error("Hora inicio requerida");
    if (!endTime) throw new Error("Hora fin requerida");

    this.id = id;
    this.doctorId = doctorId;
    this.branchId = branchId;
    this.officeId = officeId;

    this.weekDay = weekDay;
    this.startTime = startTime;
    this.endTime = endTime;

    this.isActive = isActive;

    this.doctor = doctor;
    this.branch = branch;
    this.office = office;
  }
}

module.exports = DoctorSchedule;