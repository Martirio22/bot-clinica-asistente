const AppointmentStatus = require("../Dominio/Entidades/AppointmentStatus");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearAppointmentStatus {
  constructor(apRepository) {
    this.apRepository = apRepository;
  }

  async ejecutar(data) {
    if (await this.apRepository.findByCode(data.code)) {
      throw new ConflictError("El código de estado ya existe");
    }

    return await this.apRepository.create(
      new AppointmentStatus({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearAppointmentStatus;