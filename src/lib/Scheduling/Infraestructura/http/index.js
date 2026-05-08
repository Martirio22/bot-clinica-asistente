const PasswordHasher = require("../../../../shared/security/PasswordHasher");
const TokenService = require("../../../../shared/security/TokenService");

const UserRepositorySequelize = require("../../../Security/Users/Infraestructura/UserRepositorySequelize");
const DoctorRepositorySequelize = require("../../../Clinic/Doctors/Infraestructura/DoctorRepositorySequelize");
const BranchRepositorySequelize = require("../../../Clinic/Branches/Infraestructura/BranchRepositorySequelize");
const OfficeRepositorySequelize = require("../../../Clinic/Offices/Infraestructura/OfficeRepositorySequelize");
const ASRepositorySequelize = require("../../AppointmentStatus/Infraestructura/ASRepositorySequelize");
const SBTRepositorySequelize = require("../../ScheduleBlockType/Infraestructura/SBTRepositorySequelize");
const DoctorScheduleRepositorySequelize = require("../../DoctorSchedules/Infraestructura/DoctorScheduleRepositorySequelize");
const ScheduleBlockRepositorySequelize = require("../../DoctorScheduleBlocks/Infraestructura/ScheduleBlockRepositorySequelize");
const AppointmentRepositorySequelize = require("../../Appointments/Infraestructura/AppointmentRepositorySequelize");
const PatientRepositorySequelize = require("../../../Clinic/Patients/Infraestructura/PatientRepositorySequelize");
const SpecialtyRepositorySequelize = require("../../../Clinic/Specialties/Infraestructura/SpecialtyRepositorySequelize");

const CrearAppointmentStatus = require("../../AppointmentStatus/Aplicacion/CrearAppointmentStatus");
const ListarAppointmentStatus = require("../../AppointmentStatus/Aplicacion/ListarAppointmentStatus");
const ObtenerAppointmentStatusPorId = require("../../AppointmentStatus/Aplicacion/ObtenerAppointmentStatusPorId");
const ActualizarAppointmentStatus = require("../../AppointmentStatus/Aplicacion/ActualizarAppointmentStatus");
const EliminarAppointmentStatus = require("../../AppointmentStatus/Aplicacion/EliminarAppointmentStatus");

const CrearScheduleBlockType = require("../../ScheduleBlockType/Aplicacion/CrearScheduleBlockType");
const ListarScheduleBlockType = require("../../ScheduleBlockType/Aplicacion/ListarScheduleBlockType");
const ObtenerScheduleBlockType = require("../../ScheduleBlockType/Aplicacion/ObtenerScheduleBlockType");
const ActualizarScheduleBlockType = require("../../ScheduleBlockType/Aplicacion/ActualizarScheduleBlockType");
const EliminarScheduleBlockType = require("../../ScheduleBlockType/Aplicacion/EliminarScheduleBlockType");

const CrearDoctorSchedule = require("../../DoctorSchedules/Aplicacion/CrearDoctorSchedule");
const ListarDoctorSchedule = require("../../DoctorSchedules/Aplicacion/ListarDoctorSchedule");
const ObtenerDoctorSchedulePorId = require("../../DoctorSchedules/Aplicacion/ObtenerDoctorSchedulePorId");
const ActualizarDoctorSchedule = require("../../DoctorSchedules/Aplicacion/ActualizarDoctorSchedule");
const EliminarDoctorSchedule = require("../../DoctorSchedules/Aplicacion/EliminarDoctorSchedule");

const CrearScheduleBlock = require("../../DoctorScheduleBlocks/Aplicacion/CrearScheduleBlock");
const ListarScheduleBlock = require("../../DoctorScheduleBlocks/Aplicacion/ListarScheduleBlock");
const ObtenerScheduleBlockPorId = require("../../DoctorScheduleBlocks/Aplicacion/ObtenerScheduleBlockPorId");
const ActualizarScheduleBlock = require("../../DoctorScheduleBlocks/Aplicacion/ActualizarScheduleBlock");
const EliminarScheduleBlock = require("../../DoctorScheduleBlocks/Aplicacion/EliminarScheduleBlock");

const CrearAppointment = require("../../Appointments/Aplicacion/CrearAppointment");
const ListarAppointment = require("../../Appointments/Aplicacion/ListarAppointment");
const ObtenerAppointmentPorId = require("../../Appointments/Aplicacion/ObtenerAppointmentPorId");
const ObtenerDisponibilidadPorMedico = require("../../Appointments/Aplicacion/ObtenerDisponibilidadPorMedico");
const ActualizarAppointment = require("../../Appointments/Aplicacion/ActualizarAppointment");
const EliminarAppointment = require("../../Appointments/Aplicacion/EliminarAppointment");

const AppointmentStatusController = require("../../AppointmentStatus/Infraestructura/http/AppointmentStatusController");
const AppointmentStatusRoutes = require("../../AppointmentStatus/Infraestructura/http/AppointmentStatusRoutes");
const ScheduleBlockTypeController = require("../../ScheduleBlockType/Infraestructura/http/ScheduleBlockTypeController");
const ScheduleBlockTypeRoutes = require("../../ScheduleBlockType/Infraestructura/http/ScheduleBlockTypeRoutes");
const DoctorScheduleController = require("../../DoctorSchedules/Infraestructura/http/DoctorScheduleController");
const DoctorScheduleRoutes = require("../../DoctorSchedules/Infraestructura/http/DoctorScheduleRoutes");
const ScheduleBlockController = require("../../DoctorScheduleBlocks/Infraestructura/http/ScheduleBlockController");
const ScheduleBlockRoutes = require("../../DoctorScheduleBlocks/Infraestructura/http/ScheduleBlockRoutes");
const AppointmentController = require("../../Appointments/Infraestructura/http/AppointmentController");
const AppointmentRoutes = require("../../Appointments/Infraestructura/http/AppointmentRoutes");

const e = require("express");

module.exports = function registerSchedulingModule(app){
    
    const appointmentStatusRepository = new ASRepositorySequelize();
    const scheduleBlockTypeRepository = new SBTRepositorySequelize();
    const doctorScheduleRepository = new DoctorScheduleRepositorySequelize();
    const doctorRepository = new DoctorRepositorySequelize();
    const branchRepository = new BranchRepositorySequelize();
    const officeRepository = new OfficeRepositorySequelize();
    const blockRepository = new ScheduleBlockRepositorySequelize();
    const userRepository = new UserRepositorySequelize();
    const appointmentRepository = new AppointmentRepositorySequelize();
    const patientRepository = new PatientRepositorySequelize();
    const specialtyRepository = new SpecialtyRepositorySequelize();

const appointmentStatusController = new AppointmentStatusController({
  crear: new CrearAppointmentStatus(appointmentStatusRepository),
  listar: new ListarAppointmentStatus(appointmentStatusRepository),
  obtener: new ObtenerAppointmentStatusPorId(appointmentStatusRepository),
  actualizar: new ActualizarAppointmentStatus(appointmentStatusRepository),
  eliminar: new EliminarAppointmentStatus(appointmentStatusRepository)
});

const scheduleBlockTypeController = new ScheduleBlockTypeController({
  crear: new CrearScheduleBlockType(scheduleBlockTypeRepository),
  listar: new ListarScheduleBlockType(scheduleBlockTypeRepository),
  obtener: new ObtenerScheduleBlockType(scheduleBlockTypeRepository),
  actualizar: new ActualizarScheduleBlockType(scheduleBlockTypeRepository),
  eliminar: new EliminarScheduleBlockType(scheduleBlockTypeRepository)
});

const doctorScheduleController = new DoctorScheduleController({
  crear: new CrearDoctorSchedule(doctorScheduleRepository, doctorRepository, branchRepository, officeRepository),
  listar: new ListarDoctorSchedule(doctorScheduleRepository),
  obtener: new ObtenerDoctorSchedulePorId(doctorScheduleRepository),
  actualizar: new ActualizarDoctorSchedule(doctorScheduleRepository, branchRepository, officeRepository),
  eliminar: new EliminarDoctorSchedule(doctorScheduleRepository)
});

const scheduleBlockController = new ScheduleBlockController({
  crear: new CrearScheduleBlock(blockRepository, doctorRepository, scheduleBlockTypeRepository, userRepository),
  listar: new ListarScheduleBlock(blockRepository),
  obtener: new ObtenerScheduleBlockPorId(blockRepository),
  actualizar: new ActualizarScheduleBlock(blockRepository, scheduleBlockTypeRepository),
  eliminar: new EliminarScheduleBlock(blockRepository)
});

const appointmentController = new AppointmentController({
        crear: new CrearAppointment(appointmentRepository, doctorRepository, patientRepository, doctorScheduleRepository, blockRepository,
          specialtyRepository, branchRepository, officeRepository, appointmentStatusRepository),
        listar: new ListarAppointment(appointmentRepository),
        obtener: new ObtenerAppointmentPorId(appointmentRepository),
        actualizar: new ActualizarAppointment(appointmentRepository, doctorRepository),
        eliminar: new EliminarAppointment(appointmentRepository),
        disponibilidad: new ObtenerDisponibilidadPorMedico( appointmentRepository, doctorScheduleRepository, blockRepository, doctorRepository )
    });

app.use("/api/scheduling/appointment-status", AppointmentStatusRoutes(appointmentStatusController));
app.use("/api/scheduling/block-types", ScheduleBlockTypeRoutes(scheduleBlockTypeController));
app.use("/api/scheduling/doctor-schedules", DoctorScheduleRoutes(doctorScheduleController));
app.use("/api/scheduling/block", ScheduleBlockRoutes(scheduleBlockController));
app.use("/api/scheduling/appointments", AppointmentRoutes(appointmentController));
}