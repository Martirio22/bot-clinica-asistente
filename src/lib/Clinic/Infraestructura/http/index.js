const PasswordHasher = require("../../../../shared/security/PasswordHasher");
const TokenService = require("../../../../shared/security/TokenService");

const BranchRepositorySequelize = require("../../Branches/Infraestructura/BranchRepositorySequelize");
const OfficeRepositorySequelize = require("../../Offices/Infraestructura/OfficeRepositorySequelize");
const SpecialtyRepositorySequelize = require("../../Specialties/Infraestructura/SpecialtyRepositorySequelize");
const DoctorRepositorySequelize = require("../../Doctors/Infraestructura/DoctorRepositorySequelize");
const PatientRepositorySequelize = require("../../Patients/Infraestructura/PatientRepositorySequelize")

const CrearBranch = require("../../Branches/Aplicacion/CrearBranch");
const ListarBranch = require("../../Branches/Aplicacion/ListarBranch");
const ObtenerBranchPorId = require("../../Branches/Aplicacion/ObtenerBranchPorId");
const ActualizarBranch = require("../../Branches/Aplicacion/ActualizarBranch");
const EliminarBranch = require("../../Branches/Aplicacion/EliminarBranch");

const CrearOffice = require("../../Offices/Aplicacion/CrearOffice");
const ListarOffice = require("../../Offices/Aplicacion/ListarOffice");
const ObtenerOfficePorId = require("../../Offices/Aplicacion/ObtenerOfficePorId");
const ActualizarOffice = require("../../Offices/Aplicacion/ActualizarOffice");
const EliminarOffice = require("../../Offices/Aplicacion/EliminarOffice");

const CrearSpecialty = require("../../Specialties/Aplicacion/CrearSpecialty");
const ListarSpecialty = require("../../Specialties/Aplicacion/ListarSpecialty");
const ObtenerSpecialty = require("../../Specialties/Aplicacion/ObtenerSpecialtyPorId");
const ActualizarSpecialty = require("../../Specialties/Aplicacion/ActualizarSpecialty");
const EliminarSpecialty = require("../../Specialties/Aplicacion/EliminarSpecialty");

const CrearDoctor = require("../../Doctors/Aplicacion/CrearDoctor");
const ListarDoctor = require("../../Doctors/Aplicacion/ListarDoctor");
const ObtenerDoctor = require("../../Doctors/Aplicacion/ObtenerDoctorPorId");
const ActualizarDoctor = require("../../Doctors/Aplicacion/ActualizarDoctor");
const EliminarDoctor = require("../../Doctors/Aplicacion/EliminarDoctor");

const CrearPaciente = require("../../Patients/Aplicacion/CrearPatient");
const ListarPaciente = require("../../Patients/Aplicacion/ListarPatient");
const ObtenerPaciente = require("../../Patients/Aplicacion/ObtenerPatientPorId");
const ActualizarPaciente = require("../../Patients/Aplicacion/ActualizarPatient");
const EliminarPaciente = require("../../Patients/Aplicacion/EliminarPatient");

const BranchController = require("../../Branches/Infraestructura/http/BranchController");
const BranchRoutes = require("../../Branches/Infraestructura/http/BranchRoutes");
const OfficeController = require("../../Offices/Infraestructura/http/OfficeController");
const OfficeRoutes = require("../../Offices/Infraestructura/http/OfficeRoutes");
const SpecialtyController = require("../../Specialties/Infraestructura/http/SpecialtyController");
const SpecialtyRoutes = require("../../Specialties/Infraestructura/http/SpecialtyRoutes");
const DoctorController = require("../../Doctors/Infraestructura/http/DoctorController");
const DoctorRoutes = require("../../Doctors/Infraestructura/http/DoctorRoutes");
const PatientController = require("../../Patients/Infraestructura/http/PatientController");
const PatientRoutes = require("../../Patients/Infraestructura/http/PatientRoutes");

module.exports = function registerClinicModule(app) {

  const branchRepository = new BranchRepositorySequelize();
  const officeRepository = new OfficeRepositorySequelize();
  const specialtyRepository = new SpecialtyRepositorySequelize();
  const doctorRepository = new DoctorRepositorySequelize();
  const pacienteRepository = new PatientRepositorySequelize();

  const branchController = new BranchController({
    crear: new CrearBranch(branchRepository),
    listar: new ListarBranch(branchRepository),
    obtener: new ObtenerBranchPorId(branchRepository),
    actualizar: new ActualizarBranch(branchRepository),
    eliminar: new EliminarBranch(branchRepository)
  });

  const officeController = new OfficeController({
  crear: new CrearOffice(officeRepository),
  listar: new ListarOffice(officeRepository),
  obtener: new ObtenerOfficePorId(officeRepository),
  actualizar: new ActualizarOffice(officeRepository),
  eliminar: new EliminarOffice(officeRepository)
});

const specialtyController = new SpecialtyController({
  crear: new CrearSpecialty(specialtyRepository),
  listar: new ListarSpecialty(specialtyRepository),
  obtener: new ObtenerSpecialty(specialtyRepository),
  actualizar: new ActualizarSpecialty(specialtyRepository),
  eliminar: new EliminarSpecialty(specialtyRepository)
});

const doctorController = new DoctorController({
  crear: new CrearDoctor(doctorRepository),
  listar: new ListarDoctor(doctorRepository),
  obtener: new ObtenerDoctor(doctorRepository),
  actualizar: new ActualizarDoctor(doctorRepository),
  eliminar: new EliminarDoctor(doctorRepository)
});

const patientController = new PatientController({
  crear: new CrearPaciente(pacienteRepository),
  listar: new ListarPaciente(pacienteRepository),
  obtener: new ObtenerPaciente(pacienteRepository),
  actualizar: new ActualizarPaciente(pacienteRepository),
  eliminar: new EliminarPaciente(pacienteRepository)
})

  app.use("/api/clinic/branches", BranchRoutes(branchController));
  app.use("/api/clinic/offices", OfficeRoutes(officeController));
  app.use("/api/clinic/specialties", SpecialtyRoutes(specialtyController));
  app.use("/api/clinic/doctors", DoctorRoutes(doctorController));
  app.use("/api/clinic/patients", PatientRoutes(patientController));
};
