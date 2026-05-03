class Patient {
  constructor({
    id,
    identificationType = null,
    identification = null,
    firstName,
    lastName,
    birthDate = null,
    gender = null,
    email = null,
    whatsappPhone,
    address = null,
    isActive = true
  }) {
    if (!firstName) throw new Error("firstName required");
    if (!lastName) throw new Error("lastName required");
    if (!whatsappPhone) throw new Error("whatsappPhone required");

    this.id = id;
    this.identificationType = identificationType;
    this.identification = identification;
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.birthDate = birthDate;
    this.gender = gender;
    this.email = email.trim().toLowerCase();
    this.whatsappPhone = whatsappPhone;
    this.address = address;
    this.isActive = isActive;
  }
}

module.exports = Patient;