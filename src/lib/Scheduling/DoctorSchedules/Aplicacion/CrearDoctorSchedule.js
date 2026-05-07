const DoctorSchedule = require("../Dominio/Entidades/DoctorSchedule");

class CrearDoctorSchedule {

  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(data) {
    const user = await this.userRepository.findById(doctorId); if(!user) throw new NotFoundError("Medico no encontrado");
    const role = await this.roleRepository.findById(branchId); if(!role) throw new NotFoundError("Sucursal no encontrado");
    const role = await this.roleRepository.findById(officeId); if(!role) throw new NotFoundError("Consultorio no encontrado");
    return await this.repository.create(
      new DoctorSchedule({
        ...data,
        isActive: true
      })
    );
  }
}

module.exports = CrearDoctorSchedule;