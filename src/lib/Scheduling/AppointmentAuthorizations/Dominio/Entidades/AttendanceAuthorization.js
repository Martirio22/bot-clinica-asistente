class AttendanceAuthorization {
  constructor({
    id,
    appointmentId,
    isAuthorized = false,
    authorizationDate = null,
    authorizedByUserId = null,
    reason = null,
    observation = null,
    isActive = true,
    appointment = null,
    authorizedByUser = null
  }) {
    if (!appointmentId) throw new Error("ID de cita requerido para la autorización");

    this.id = id;
    this.appointmentId = appointmentId;
    this.isAuthorized = isAuthorized;
    this.authorizationDate = authorizationDate;
    this.authorizedByUserId = authorizedByUserId;
    this.reason = reason;
    this.observation = observation;
    this.isActive = isActive;
    this.appointment = appointment;
    this.authorizedByUser = authorizedByUser;
  }
}

module.exports = AttendanceAuthorization;