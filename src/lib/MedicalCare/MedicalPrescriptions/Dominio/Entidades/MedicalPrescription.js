class MedicalPrescription {
  constructor({
    id,
    medicalAttentionId,
    prescriptionCode,
    issueDate = new Date(),
    generalIndications = null,
    isSentWhatsapp = false,
    whatsappSentDate = null,
    isActive = true,
    medicalAttention = null
  }) {
    if (!medicalAttentionId) throw new Error("La receta debe estar ligada a una atención médica");

    this.id = id;
    this.medicalAttentionId = medicalAttentionId;
    this.prescriptionCode = prescriptionCode;
    this.issueDate = issueDate;
    this.generalIndications = generalIndications;
    this.isSentWhatsapp = isSentWhatsapp;
    this.whatsappSentDate = whatsappSentDate;
    this.isActive = isActive;
    this.medicalAttention = medicalAttention;
  }
}

module.exports = MedicalPrescription;