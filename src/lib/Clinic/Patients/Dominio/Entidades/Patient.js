class Patient {
  constructor({
    id,
    identificationType = null,
    identification = null,
    firstName,
    lastName = "Paciente",
    birthDate = null,
    gender = null,
    email = null,
    whatsappPhone,
    address = null,
    isActive = true
  }) {
    if (!firstName) throw new Error("Nombre requerido");
    if (!whatsappPhone) throw new Error("whatsappPhone required");

    this.id = id;
    this.identificationType = identificationType;
    this.identification = identification;
    this.firstName = firstName.trim();
    this.lastName = lastName ? lastName.trim() : "Paciente";
    this.birthDate = birthDate;
    this.gender = gender;
    this.email = email ? email.trim().toLowerCase() : null;
    this.whatsappPhone = whatsappPhone;
    this.address = address;
    this.isActive = isActive;
  }
}

module.exports = Patient;