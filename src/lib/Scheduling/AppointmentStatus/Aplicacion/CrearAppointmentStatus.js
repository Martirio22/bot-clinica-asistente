const AppointmentStatus = require("../Dominio/Entidades/AppointmentStatus");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearAppointmentStatus {
  constructor(apRepository) {
    this.apRepository = apRepository;
  }

  async ejecutar(data) {
    const status = new AppointmentStatus(data);

    if (await this.apRepository.findByCode(status.code)) {
      throw new ConflictError("El código de estado ya existe");
    }

    return await this.apRepository.create(status);
  }
}

module.exports = CrearAppointmentStatus;