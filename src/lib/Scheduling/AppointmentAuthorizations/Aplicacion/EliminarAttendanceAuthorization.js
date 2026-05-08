const NotFoundError = require("../../../../shared/errors/NotFoundError");

class EliminarAttendanceAuthorization {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  async ejecutar(id) {
    const auth = await this.authRepo.findById(id);
    if (!auth) throw new NotFoundError("Registro no encontrado");
    await this.authRepo.softDelete(id);
  }
}

module.exports = EliminarAttendanceAuthorization;