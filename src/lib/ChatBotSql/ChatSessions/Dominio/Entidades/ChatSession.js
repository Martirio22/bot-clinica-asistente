class ChatSession {
  constructor({
    id,
    patientId = null,
    whatsappLineId,
    sessionStatusId,
    patientWhatsappNumber,
    patientWhatsappName = null,
    handledByBot = true,
    assignedAssistantId = null,
    startDate = null,
    humanAssignmentDate = null,
    closeDate = null,
    closeReason = null,
    conversationSummary = null,
    
    // 1. Recibimos las relaciones anidadas inyectadas por FULL_INCLUDE
    patient = null,
    status = null,
    assignedAssistant = null,
    whatsappLine = null
  }) {
    // Validaciones esenciales para la creación de nuevas instancias
    if (!whatsappLineId) throw new Error("La línea de WhatsApp es requerida");
    if (!sessionStatusId) throw new Error("El estado de la sesión es requerido");
    if (!patientWhatsappNumber) throw new Error("El número de WhatsApp del paciente es requerido");

    this.id = id;
    this.patientId = patientId;
    this.whatsappLineId = whatsappLineId;
    this.sessionStatusId = sessionStatusId;
    this.patientWhatsappNumber = patientWhatsappNumber.trim();
    this.patientWhatsappName = patientWhatsappName ? patientWhatsappName.trim() : null;
    this.handledByBot = handledByBot;
    this.assignedAssistantId = assignedAssistantId;
    
    // Manejo seguro de fechas para evitar mutaciones extrañas al leer de DB
    this.startDate = startDate ? new Date(startDate) : new Date();
    this.humanAssignmentDate = humanAssignmentDate ? new Date(humanAssignmentDate) : null;
    this.closeDate = closeDate ? new Date(closeDate) : null;
    
    this.closeReason = closeReason ? closeReason.trim() : null;
    this.conversationSummary = conversationSummary ? conversationSummary.trim() : null;

    // Asignamos las propiedades anidadas para que viajen limpias al controlador
    this.patient = patient;
    this.status = status;
    this.assignedAssistant = assignedAssistant;
    this.whatsappLine = whatsappLine;
  }
}

module.exports = ChatSession;