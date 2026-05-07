const Paciente = require("../Dominio/Entidades/Patient");
const ConflictError = require("../../../../shared/errors/ConflictError");

class CrearPaciente {
  constructor(pacienteRepository) {
    this.pacienteRepository = pacienteRepository;
  }

  async ejecutar(data) {
  const nuevoPaciente = new Paciente({ ...data, isActive: true });

  if (await this.pacienteRepository.findByEmail(nuevoPaciente.email)) 
    throw new ConflictError("Ya existe un paciente con ese email");
  
  if (await this.pacienteRepository.findByIdentification(nuevoPaciente.identification)) 
    throw new ConflictError("Ya existe un paciente con esa identificación");
  
  if (await this.pacienteRepository.findByPhone(nuevoPaciente.whatsappPhone)) 
    throw new ConflictError("Ya existe un paciente con ese número telefónico");
    
  return await this.pacienteRepository.create(nuevoPaciente);
}
}

module.exports = CrearPaciente;