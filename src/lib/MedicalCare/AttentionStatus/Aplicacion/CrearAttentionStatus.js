const AttentionStatus = require("../Dominio/Entidades/AttentionStatus");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearAttentionStatus {
  constructor(asRepository) {
    this.asRepository = asRepository;
  }

  async ejecutar(data) {
    if (await this.asRepository.findByCode(data.code)) {
      throw new ConflictError("El código del estado de atención ya existe");
    }

    return await this.asRepository.create(
      new AttentionStatus({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearAttentionStatus;