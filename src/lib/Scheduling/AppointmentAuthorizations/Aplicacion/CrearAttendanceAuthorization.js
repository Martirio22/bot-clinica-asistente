const AttendanceAuthorization = require("../Dominio/Entidades/AttendanceAuthorization");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConflictError = require("../../../../shared/errors/ConflictError");

class AuthorizeAttendance {
  constructor(authRepo, appointmentRepo, userRepo) {
    this.authRepo = authRepo;
    this.appointmentRepo = appointmentRepo;
    this.userRepo = userRepo;
  }

  async ejecutar(data, authorizedByUserId) {
    const nuevaAuth = new AttendanceAuthorization({
      ...data,
      authorizedByUserId,
      authorizationDate: new Date(),
      isAuthorized: true
    });
    const appointment = await this.appointmentRepo.findById(nuevaAuth.appointmentId);
    if (!appointment) throw new NotFoundError("La cita no existe");
    if (!appointment.isActive) { throw new ConflictError("No se puede autorizar una cita que ha sido cancelada o está inactiva");}
    const existingAuth = await this.authRepo.findByAppointmentId(nuevaAuth.appointmentId);
    if (existingAuth) throw new ConflictError("Esta cita ya ha sido autorizada previamente");
    const user = await this.userRepo.findById(authorizedByUserId);
    if (!user) throw new NotFoundError("Usuario autorizador no encontrado");
    const enEsperaStatusId = await this.appointmentRepo.findStatusByCode('EN_ESPERA');
    if (!enEsperaStatusId) { throw new NotFoundError("El estado 'EN_ESPERA' no está configurado en el sistema");}
    const authCreada = await this.authRepo.create(nuevaAuth);
    await this.appointmentRepo.updateStatus(nuevaAuth.appointmentId, enEsperaStatusId);

    return authCreada;
  }
}

module.exports = AuthorizeAttendance;