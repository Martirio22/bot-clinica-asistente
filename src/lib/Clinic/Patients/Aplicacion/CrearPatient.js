const Paciente = require("../Dominio/Entidades/Patient");

class CrearPaciente {
  constructor(pacienteRepository) {
    this.pacienteRepository = pacienteRepository;
  }

  async ejecutar(data) {
    if (await this.pacienteRepository.findByEmail(data.email)) throw new ConflictError("Ya existe un paciente con ese email");
    if (await this.pacienteRepository.findByName(data.firstName)) throw new ConflictError("Ya existe el paciente");
    if (await this.pacienteRepository.findByIdentification(data.identification)) throw new ConflictError("Ya existe un paciente con esa identificacion");
    return await this.pacienteRepository.create(
      new Paciente({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearPaciente;