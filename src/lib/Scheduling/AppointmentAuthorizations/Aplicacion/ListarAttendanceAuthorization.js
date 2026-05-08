class ListarAttendanceAuthorization {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  async ejecutar(filtros) {
    return await this.authRepo.findAll(filtros);
  }
}

module.exports = ListarAttendanceAuthorization;