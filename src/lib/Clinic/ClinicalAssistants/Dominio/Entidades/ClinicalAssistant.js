class ClinicalAssistant {
  constructor({
    id,
    userId,
    canManageChat = true,
    canScheduleAppointments = true,
    canAuthorizeCare = true,
    isActive = true,
    user = null
  }) {
    if (!userId) throw new Error("usuario requerido");

    this.id = id;
    this.userId = userId;
    this.canManageChat = canManageChat;
    this.canScheduleAppointments = canScheduleAppointments;
    this.canAuthorizeCare = canAuthorizeCare;
    this.isActive = isActive;

    this.user = user;
  }
}

module.exports = ClinicalAssistant;