class MedicalPrescriptionDetail {
  constructor({
    id,
    medicalPrescriptionId,
    medicine,
    dose,
    frequency,
    duration,
    indications = null,
    order = 1,
    isActive = true
  }) {
    if (!medicalPrescriptionId) throw new Error("El detalle debe estar ligado a una receta médica");
    if (!medicine) throw new Error("El nombre del medicamento es obligatorio");

    this.id = id;
    this.medicalPrescriptionId = medicalPrescriptionId;
    this.medicine = medicine;
    this.dose = dose;
    this.frequency = frequency;
    this.duration = duration;
    this.indications = indications;
    this.order = order;
    this.isActive = isActive;
  }
}

module.exports = MedicalPrescriptionDetail;