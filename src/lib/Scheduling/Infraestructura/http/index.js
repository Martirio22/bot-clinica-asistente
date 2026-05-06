const PasswordHasher = require("../../../../shared/security/PasswordHasher");
const TokenService = require("../../../../shared/security/TokenService");

const ASRepositorySequelize = require("../../AppointmentStatus/Infraestructura/ASRepositorySequelize");
const SBTRepositorySequelize = require("../../ScheduleBlockType/Infraestructura/SBTRepositorySequelize");

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

const AppointmentStatusController = require("../../AppointmentStatus/Infraestructura/http/AppointmentStatusController");
const AppointmentStatusRoutes = require("../../AppointmentStatus/Infraestructura/http/AppointmentStatusRoutes");
const ScheduleBlockTypeController = require("../../ScheduleBlockType/Infraestructura/http/ScheduleBlockTypeController");
const ScheduleBlockTypeRoutes = require("../../ScheduleBlockType/Infraestructura/http/ScheduleBlockTypeRoutes");
const e = require("express");

module.exports = function registerSchedulingModule(app){
    
    const appointmentStatusRepository = new ASRepositorySequelize();
    const scheduleBlockTypeRepository = new SBTRepositorySequelize();

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

app.use("/api/scheduling/appointment-status", AppointmentStatusRoutes(appointmentStatusController));
app.use("/api/scheduling/block-types", ScheduleBlockTypeRoutes(scheduleBlockTypeController));
}