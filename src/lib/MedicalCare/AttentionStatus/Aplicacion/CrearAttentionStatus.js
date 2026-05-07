const AttentionStatus = require("../Dominio/Entidades/AttentionStatus");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearAttentionStatus {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

 async ejecutar(data) {
    const nuevoStatus = new AttentionStatus({
      ...data,
      isActive: true
    });

    if (await this.asRepository.findByCode(nuevoStatus.code)) {
      throw new ConflictError("El código del estado de atención ya existe");
    }

    return await this.asRepository.create(nuevoStatus);
  }
}

module.exports = CrearAttentionStatus;