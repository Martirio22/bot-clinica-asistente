class Doctor {
  constructor({
    id,
    userId,
    specialtyId,
    professionalRegistry = null,
    appointmentDurationMinutes = 30,
    attendsWhatsApp = true,
    isActive = true,
    user = null,
    specialty = null
  }) {
    if (!userId) throw new Error("usuario requerido");
    if (!specialtyId) throw new Error("especialidad requerida");

    this.id = id;
    this.userId = userId;
    this.specialtyId = specialtyId;
    this.professionalRegistry = professionalRegistry;
    this.appointmentDurationMinutes = appointmentDurationMinutes;
    this.attendsWhatsApp = attendsWhatsApp;
    this.isActive = isActive;

    this.user = user;
    this.specialty = specialty;
  }
}

module.exports = Doctor;