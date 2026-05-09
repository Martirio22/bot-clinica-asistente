const AtSRepositorySequelize = require("../../AttentionStatus/Infraestructura/AtSRepositorySequelize");
const MARepositorySequelize = require("../../MedicalAttentions/Infraestructura/MARepositorySequelize");
const AppointmentSequelize = require("../../../Scheduling/Appointments/Infraestructura/AppointmentRepositorySequelize");

const CrearAttentionStatus = require("../../AttentionStatus/Aplicacion/CrearAttentionStatus");
const ListarAttentionStatus = require("../../AttentionStatus/Aplicacion/ListarAttentionStatus");
const ObtenerAttentionStatusPorId = require("../../AttentionStatus/Aplicacion/ObtenerAttentionStatusPorId");
const ActualizarAttentionStatus = require("../../AttentionStatus/Aplicacion/ActualizarAttentionStatus");
const EliminarAttentionStatus = require("../../AttentionStatus/Aplicacion/EliminarAttentionStatus");

const IniciarMedicalAttention = require("../../MedicalAttentions/Aplicacion/IniciarMedicalAttention");
const FinalizarMedicalAttention = require("../../MedicalAttentions/Aplicacion/FinalizarMedicalAttention");
const EliminarMedicalAttention = require("../../MedicalAttentions/Aplicacion/EliminarMedicalAttention");

const AttentionStatusController = require("../../AttentionStatus/Infraestructura/http/AttentionStatusController");
const AttentionStatusRoutes = require("../../AttentionStatus/Infraestructura/http/AttentionStatusRoutes");
const MedicalAttentionController = require("../../MedicalAttentions/Infraestructura/http/MedicalAttentionController");
const MedicalAttentionRoutes = require("../../MedicalAttentions/Infraestructura/http/MedicalAttentionRoutes");

module.exports = function registerMedicalCareModule(app){

    const attentionStatusRepository = new AtSRepositorySequelize();
    const medicalAttentionRepository = new MARepositorySequelize();
    const appointmentRepository = new AppointmentSequelize();

    const attentionStatusController = new AttentionStatusController({
        crear: new CrearAttentionStatus(attentionStatusRepository),
        listar: new ListarAttentionStatus(attentionStatusRepository),
        obtener: new ObtenerAttentionStatusPorId(attentionStatusRepository),
        actualizar: new ActualizarAttentionStatus(attentionStatusRepository),
        eliminar: new EliminarAttentionStatus(attentionStatusRepository)
    });

    const medicalAttentionController = new MedicalAttentionController({
        iniciar: new IniciarMedicalAttention(medicalAttentionRepository, appointmentRepository),
        finalizar: new FinalizarMedicalAttention(medicalAttentionRepository),
        eliminar: new EliminarMedicalAttention(medicalAttentionRepository)
    });

    app.use("/api/medicalcare/attention-status", AttentionStatusRoutes(attentionStatusController));
    app.use("/api/medicalcare/medical_attention", MedicalAttentionRoutes(medicalAttentionController));
}