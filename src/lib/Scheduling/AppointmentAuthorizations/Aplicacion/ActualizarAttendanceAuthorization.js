const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarAttendanceAuthorization {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  async ejecutar(id, data) {
    const auth = await this.authRepo.findById(id);
    if (!auth) throw new NotFoundError("Registro de autorización no encontrado");

    return await this.authRepo.update(id, {
      reason: data.reason ?? auth.reason,
      observation: data.observation ?? auth.observation
    });
  }
}

module.exports = ActualizarAttendanceAuthorization;