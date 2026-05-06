const PasswordHasher = require("../../../../shared/security/PasswordHasher");
const TokenService = require("../../../../shared/security/TokenService");

const AtSRepositorySequelize = require("../../AttentionStatus/Infraestructura/AtSRepositorySequelize");

const CrearAttentionStatus = require("../../AttentionStatus/Aplicacion/CrearAttentionStatus");
const ListarAttentionStatus = require("../../AttentionStatus/Aplicacion/ListarAttentionStatus");
const ObtenerAttentionStatusPorId = require("../../AttentionStatus/Aplicacion/ObtenerAttentionStatusPorId");
const ActualizarAttentionStatus = require("../../AttentionStatus/Aplicacion/ActualizarAttentionStatus");
const EliminarAttentionStatus = require("../../AttentionStatus/Aplicacion/EliminarAttentionStatus");

const AttentionStatusController = require("../../AttentionStatus/Infraestructura/http/AttentionStatusController");
const AttentionStatusRoutes = require("../../AttentionStatus/Infraestructura/http/AttentionStatusRoutes");

module.exports = function registerMedicalCareModule(app){

    const attentionStatusRepository = new AtSRepositorySequelize();

    const attentionStatusController = new AttentionStatusController({
        crear: new CrearAttentionStatus(attentionStatusRepository),
        listar: new ListarAttentionStatus(attentionStatusRepository),
        obtener: new ObtenerAttentionStatusPorId(attentionStatusRepository),
        actualizar: new ActualizarAttentionStatus(attentionStatusRepository),
        eliminar: new EliminarAttentionStatus(attentionStatusRepository)
    });

    app.use("/api/medicalcare/attention-status", AttentionStatusRoutes(attentionStatusController));
}