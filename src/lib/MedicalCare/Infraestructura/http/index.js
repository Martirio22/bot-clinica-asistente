const AtSRepositorySequelize = require("../../AttentionStatus/Infraestructura/AtSRepositorySequelize");
const MARepositorySequelize = require("../../MedicalAttentions/Infraestructura/MARepositorySequelize");
const AppointmentSequelize = require("../../../Scheduling/Appointments/Infraestructura/AppointmentRepositorySequelize");
const MedicalPrescriptionSequelize = require("../../MedicalPrescriptions/Infraestructura/MPRepositorySequelize");

const CrearAttentionStatus = require("../../AttentionStatus/Aplicacion/CrearAttentionStatus");
const ListarAttentionStatus = require("../../AttentionStatus/Aplicacion/ListarAttentionStatus");
const ObtenerAttentionStatusPorId = require("../../AttentionStatus/Aplicacion/ObtenerAttentionStatusPorId");
const ActualizarAttentionStatus = require("../../AttentionStatus/Aplicacion/ActualizarAttentionStatus");
const EliminarAttentionStatus = require("../../AttentionStatus/Aplicacion/EliminarAttentionStatus");

const IniciarMedicalAttention = require("../../MedicalAttentions/Aplicacion/IniciarMedicalAttention");
const FinalizarMedicalAttention = require("../../MedicalAttentions/Aplicacion/FinalizarMedicalAttention");
const EliminarMedicalAttention = require("../../MedicalAttentions/Aplicacion/EliminarMedicalAttention");
const ListarMedicalAttention = require("../../MedicalAttentions/Aplicacion/ListarMedicalAttention");
const ObtenerMedicalAttentionPorId = require("../../MedicalAttentions/Aplicacion/ObtenerMedicalAttentionPorId");

const CrearMedicalPrescription = require("../../MedicalPrescriptions/Aplicacion/CrearMedicalPrescription");
const ListarMedicalPrescription = require("../../MedicalPrescriptions/Aplicacion/ListarMedicalPrescription");
const ObtenerMedicalPrescriptionPorId = require("../../MedicalPrescriptions/Aplicacion/ObtenerMedicalPrescriptionPorId");
const ActualizarMedicalPrescription = require("../../MedicalPrescriptions/Aplicacion/ActualizarMedicalPrescription");
const EnviarPrescriptionWhatsapp = require("../../MedicalPrescriptions/Aplicacion/EnviarPrescriptionWhatsApp");
const EliminarMedicalPrescription = require("../../MedicalPrescriptions/Aplicacion/EliminarMedicalPrescription");

const AttentionStatusController = require("../../AttentionStatus/Infraestructura/http/AttentionStatusController");
const AttentionStatusRoutes = require("../../AttentionStatus/Infraestructura/http/AttentionStatusRoutes");
const MedicalAttentionController = require("../../MedicalAttentions/Infraestructura/http/MedicalAttentionController");
const MedicalAttentionRoutes = require("../../MedicalAttentions/Infraestructura/http/MedicalAttentionRoutes");
const MedicalPrescriptionController = require("../../MedicalPrescriptions/Infraestructura/http/MedicalPrescriptionController");
const MedicalPrescriptionRoutes = require("../../MedicalPrescriptions/Infraestructura/http/MedicalPrescriptionRoutes");
const MPRepositorySequelize = require("../../MedicalPrescriptions/Infraestructura/MPRepositorySequelize");

module.exports = function registerMedicalCareModule(app){

    const attentionStatusRepository = new AtSRepositorySequelize();
    const medicalAttentionRepository = new MARepositorySequelize();
    const appointmentRepository = new AppointmentSequelize();
    const medicalPrescriptionRepository = new MPRepositorySequelize();

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
        eliminar: new EliminarMedicalAttention(medicalAttentionRepository),
        listar: new ListarMedicalAttention(medicalAttentionRepository),
        obtener: new ObtenerMedicalAttentionPorId(medicalAttentionRepository)
    });

    const medicalPrescriptionController = new MedicalPrescriptionController({
    crear: new CrearMedicalPrescription(medicalPrescriptionRepository, medicalAttentionRepository),
    enviarWhatsapp: new EnviarPrescriptionWhatsapp(medicalPrescriptionRepository),
    listar: new ListarMedicalPrescription(medicalPrescriptionRepository),
    obtener: new ObtenerMedicalPrescriptionPorId(medicalPrescriptionRepository),
    actualizar: new ActualizarMedicalPrescription(medicalPrescriptionRepository),
    eliminar: new EliminarMedicalPrescription(medicalPrescriptionRepository)
});

    app.use("/api/medicalcare/attention-status", AttentionStatusRoutes(attentionStatusController));
    app.use("/api/medicalcare/medical_attention", MedicalAttentionRoutes(medicalAttentionController));
    app.use("/api/medicalcare/prescriptions", MedicalPrescriptionRoutes(medicalPrescriptionController));
}