const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ObtenerAttendanceAuthorizationPorId {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  async ejecutar(id) {
    const auth = await this.authRepo.findById(id);
    if (!auth) throw new NotFoundError("Registro de autorización no encontrado");
    return auth;
  }
}

module.exports = ObtenerAttendanceAuthorizationPorId;