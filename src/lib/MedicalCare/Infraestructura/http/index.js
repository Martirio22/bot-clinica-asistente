const AtSRepositorySequelize = require("../../AttentionStatus/Infraestructura/AtSRepositorySequelize");
const MARepositorySequelize = require("../../MedicalAttentions/Infraestructura/MARepositorySequelize");
const AppointmentSequelize = require("../../../Scheduling/Appointments/Infraestructura/AppointmentRepositorySequelize");
const MPRepositorySequelize = require("../../MedicalPrescriptions/Infraestructura/MPRepositorySequelize");
const MPDRepositorySequelize = require("../../MedicalPrescriptionDetails/Infraestructura/MPDRepositorySequelize");

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

const CrearMedicalPrescriptionDetail = require("../../MedicalPrescriptionDetails/Aplicacion/CrearMedicalPrescriptionDetail");
const ListarMedicalPrescriptionDetail = require("../../MedicalPrescriptionDetails/Aplicacion/ListarMedicalPrescriptionDetail");
const ObtenerMedicalPrescriptionDetailPorId = require("../../MedicalPrescriptionDetails/Aplicacion/ObtenerMedicalPrescriptionDetailPorId");
const ActualizarMedicalPrescriptionDetail = require("../../MedicalPrescriptionDetails/Aplicacion/ActualizarMedicalPrescriptionDetail");
const EliminarMedicalPrescriptionDetail = require("../../MedicalPrescriptionDetails/Aplicacion/EliminarMedicalPrescriptionDetail");

const AttentionStatusController = require("../../AttentionStatus/Infraestructura/http/AttentionStatusController");
const AttentionStatusRoutes = require("../../AttentionStatus/Infraestructura/http/AttentionStatusRoutes");
const MedicalAttentionController = require("../../MedicalAttentions/Infraestructura/http/MedicalAttentionController");
const MedicalAttentionRoutes = require("../../MedicalAttentions/Infraestructura/http/MedicalAttentionRoutes");
const MedicalPrescriptionController = require("../../MedicalPrescriptions/Infraestructura/http/MedicalPrescriptionController");
const MedicalPrescriptionRoutes = require("../../MedicalPrescriptions/Infraestructura/http/MedicalPrescriptionRoutes");
const MedicalPrescriptionDetailController = require("../../MedicalPrescriptionDetails/Infraestructura/http/MedicalPrescriptionDetailController");
const MedicalPrescriptionDetailRoutes = require("../../MedicalPrescriptionDetails/Infraestructura/http/MedicalPrescriptionDetailRoutes");

module.exports = function registerMedicalCareModule(app){

    const attentionStatusRepository = new AtSRepositorySequelize();
    const medicalAttentionRepository = new MARepositorySequelize();
    const appointmentRepository = new AppointmentSequelize();
    const medicalPrescriptionRepository = new MPRepositorySequelize();
    const prescriptionDetailRepository = new MPDRepositorySequelize();

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
    enviarWhatsapp: new EnviarPrescriptionWhatsapp(medicalPrescriptionRepository, prescriptionDetailRepository),
    listar: new ListarMedicalPrescription(medicalPrescriptionRepository),
    obtener: new ObtenerMedicalPrescriptionPorId(medicalPrescriptionRepository),
    actualizar: new ActualizarMedicalPrescription(medicalPrescriptionRepository),
    eliminar: new EliminarMedicalPrescription(medicalPrescriptionRepository)
});

    const prescriptionDetailController = new MedicalPrescriptionDetailController({
        crear: new CrearMedicalPrescriptionDetail(prescriptionDetailRepository, medicalPrescriptionRepository),
        listar: new ListarMedicalPrescriptionDetail(prescriptionDetailRepository),
        obtener: new ObtenerMedicalPrescriptionDetailPorId(prescriptionDetailRepository),
        actualizar: new ActualizarMedicalPrescriptionDetail(prescriptionDetailRepository, medicalPrescriptionRepository),
        eliminar: new EliminarMedicalPrescriptionDetail(prescriptionDetailRepository, medicalPrescriptionRepository)
    });

    app.use("/api/medicalcare/attention-status", AttentionStatusRoutes(attentionStatusController));
    app.use("/api/medicalcare/medical-attention", MedicalAttentionRoutes(medicalAttentionController));
    app.use("/api/medicalcare/prescriptions", MedicalPrescriptionRoutes(medicalPrescriptionController));
    app.use("/api/medicalcare/prescriptions-detail", MedicalPrescriptionDetailRoutes(prescriptionDetailController));
}