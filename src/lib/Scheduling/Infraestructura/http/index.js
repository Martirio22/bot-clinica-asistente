const PasswordHasher = require("../../../../shared/security/PasswordHasher");
const TokenService = require("../../../../shared/security/TokenService");

const ASRepositorySequelize = require("../../AppointmentStatus/Infraestructura/ASRepositorySequelize");

const CrearAppointmentStatus = require("../../AppointmentStatus/Aplicacion/CrearAppointmentStatus");
const ListarAppointmentStatus = require("../../AppointmentStatus/Aplicacion/ListarAppointmentStatus");
const ObtenerAppointmentStatusPorId = require("../../AppointmentStatus/Aplicacion/ObtenerAppointmentStatusPorId");
const ActualizarAppointmentStatus = require("../../AppointmentStatus/Aplicacion/ActualizarAppointmentStatus");
const EliminarAppointmentStatus = require("../../AppointmentStatus/Aplicacion/EliminarAppointmentStatus");

const AppointmentStatusController = require("../../AppointmentStatus/Infraestructura/http/AppointmentStatusController");
const AppointmentStatusRoutes = require("../../AppointmentStatus/Infraestructura/http/AppointmentStatusRoutes");

module.exports = function registerSchedulingModule(app){
    
    const appointmentStatusRepository = new ASRepositorySequelize();

const appointmentStatusController = new AppointmentStatusController({
  crear: new CrearAppointmentStatus(appointmentStatusRepository),
  listar: new ListarAppointmentStatus(appointmentStatusRepository),
  obtener: new ObtenerAppointmentStatusPorId(appointmentStatusRepository),
  actualizar: new ActualizarAppointmentStatus(appointmentStatusRepository),
  eliminar: new EliminarAppointmentStatus(appointmentStatusRepository)
});

app.use("/api/scheduling/appointment-status", AppointmentStatusRoutes(appointmentStatusController));
}