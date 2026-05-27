const ChatMessageRepositoryMongoose = require("../../ChatMessages/Infraestructura/ChatMessageRepositoryMongoose");
const CrearChatMessage = require("../../ChatMessages/Aplicacion/CrearChatMessage");
const ListarChatMessagesPorSession = require("../../ChatMessages/Aplicacion/ListarChatMessagesPorSession");
const ChatMessageController = require("../../ChatMessages/Infraestructura/http/ChatMessageController");
const ChatMessageRoutes = require("../../ChatMessages/Infraestructura/http/ChatMessageRoutes");
const ExternalWhatsappService = require("../../Infraestructura/Services/ExternalWhatsappService");
const BotMenuRepositorySequelize = require("../../../ChatBotSql/BotMenus/Infraestructura/BotMenuRepositorySequelize");
const BotMenuOptionRepositorySequelize = require("../../../ChatBotSql/BotMenuOptions/Infraestructura/BMORepositorySequelize");

const MessageDeliveryLogRepositoryMongoose = require("../../MessageDeliveryLogs/Infraestructura/MessageDeliveryLogRepositoryMongoose");
const CrearMessageDeliveryLog = require("../../MessageDeliveryLogs/Aplicacion/CrearMessageDeliveryLog");
const ListarLogsPorChatMessage = require("../../MessageDeliveryLogs/Aplicacion/ListarLogsPorChatMessage");
const MessageDeliveryLogController = require("../../MessageDeliveryLogs/Infraestructura/http/MessageDeliveryLogController");
const MessageDeliveryLogRoutes = require("../../MessageDeliveryLogs/Infraestructura/http/MessageDeliveryLogRoutes");

const WhatsappRawEventRepository = require("../../Webhooks/Infraestructura/WhatsappRawEventRepository");
const RecibirWhatsappWebhook = require("../../Webhooks/Aplicacion/RecibirWhatsappWebhook");
const WebhookController = require("../../Webhooks/Infraestructura/http/WebhookController");
const WebhookRoutes = require("../../Webhooks/Infraestructura/http/WebhookRoutes");

const ConversationContextRepositoryMongoose = require("../../ConversationContexts/Infraestructura/ConversationContextRepositoryMongoose");
const ActualizarConversationContext = require("../../ConversationContexts/Aplicacion/ActualizarConversationContext");
const ObtenerConversationContextContextoPorSession = require("../../ConversationContexts/Aplicacion/ObtenerConversationContextContextoPorSession");
const ConversationContextController = require("../../ConversationContexts/Infraestructura/http/ConversationContextController");
const ConversationContextRoutes = require("../../ConversationContexts/Infraestructura/http/ConversationContextRoutes");

const BotLogRepositoryMongoose = require("../../BotLogs/Infraestructura/BotLogRepositoryMongoose");
const RegistrarBotLog = require("../../BotLogs/Aplicacion/RegistrarBotLog");
const ListarBotLogsPorSession = require("../../BotLogs/Aplicacion/ListarBotLogsPorSession");
const BotLogController = require("../../BotLogs/Infraestructura/http/BotLogController");
const BotLogRoutes = require("../../BotLogs/Infraestructura/http/BotLogRoutes");
const PatientRepositorySequelize = require("../../../Clinic/Patients/Infraestructura/PatientRepositorySequelize");
const ChatSessionRepositorySequelize = require("../../../ChatBotSql/ChatSessions/Infraestructura/ChatSessionRepositorySequelize");

const WebhookLogRepositoryMongoose = require("../../WebhookLogs/Infraestructura/WebhookLogRepositoryMongoose");
const SpecialtyRepositorySequelize = require("../../../Clinic/Specialties/Infraestructura/SpecialtyRepositorySequelize");
const AppointmentRepositorySequelize = require("../../../Scheduling/Appointments/Infraestructura/AppointmentRepositorySequelize");
const DoctorRepositorySequelize = require("../../../Clinic/Doctors/Infraestructura/DoctorRepositorySequelize");
const DoctorScheduleRepositorySequelize = require("../../../Scheduling/DoctorSchedules/Infraestructura/DoctorScheduleRepositorySequelize");
const ScheduleBlockRepositorySequelize = require("../../../Scheduling/DoctorScheduleBlocks/Infraestructura/ScheduleBlockRepositorySequelize");
const BranchRepositorySequelize = require("../../../Clinic/Branches/Infraestructura/BranchRepositorySequelize");
const OfficeRepositorySequelize = require("../../../Clinic/Offices/Infraestructura/OfficeRepositorySequelize");
const CrearAppointment = require("../../../Scheduling/Appointments/Aplicacion/CrearAppointment");
const ObtenerDisponibilidadMedico = require("../../../Scheduling/Appointments/Aplicacion/ObtenerDisponibilidadPorMedico");
const MedicalPrescriptionRepositorySequelize = require("../../../MedicalCare/MedicalPrescriptions/Infraestructura/MPRepositorySequelize");
const GroqMedicalAssistantService = require("../../Infraestructura/Services/GroqMedicalAssistantService");
const PrescriptionPdfService = require("../../../MedicalCare/MedicalPrescriptions/Infraestructura/Services/PrescriptionPdfService");
const ExternalWhatsappMediaService = require("../../Infraestructura/Services/ExternalWhatsappMediaService");

module.exports = function registerChatBotModule(app) {
  const chatMessageRepository = new ChatMessageRepositoryMongoose();
  const deliveryRepository = new MessageDeliveryLogRepositoryMongoose();
  const rawEventRepository = new WhatsappRawEventRepository();
  const contextRepository = new ConversationContextRepositoryMongoose();
  const botLogRepository = new BotLogRepositoryMongoose();
  const webhookLogRepository = new WebhookLogRepositoryMongoose();
  const externalWhatsappService = new ExternalWhatsappService();
  const botMenuRepository = new BotMenuRepositorySequelize();
  const botMenuOptionRepository = new BotMenuOptionRepositorySequelize();
  const patientRepository = new PatientRepositorySequelize();
  const chatSessionRepository = new ChatSessionRepositorySequelize();
  const specialtyRepository = new SpecialtyRepositorySequelize();
  const appointmentRepository = new AppointmentRepositorySequelize();
  const doctorRepository = new DoctorRepositorySequelize();
  const doctorScheduleRepository = new DoctorScheduleRepositorySequelize();
  const scheduleBlockRepository = new ScheduleBlockRepositorySequelize();
  const branchRepository = new BranchRepositorySequelize();
  const officeRepository = new OfficeRepositorySequelize();
  const medicalPrescriptionRepository = new MedicalPrescriptionRepositorySequelize();
  const groqMedicalAssistantService = new GroqMedicalAssistantService();
  const prescriptionPdfService = new PrescriptionPdfService();
  const externalWhatsappMediaService = new ExternalWhatsappMediaService();

  const chatMessageController = new ChatMessageController({
    crear: new CrearChatMessage(chatMessageRepository),
    listarPorSession: new ListarChatMessagesPorSession(chatMessageRepository)
  });

  const deliveryController = new MessageDeliveryLogController({
    crear: new CrearMessageDeliveryLog(deliveryRepository, chatMessageRepository),
    listarPorMessage: new ListarLogsPorChatMessage(deliveryRepository)
  });

  const contextController = new ConversationContextController({
    actualizar: new ActualizarConversationContext(contextRepository),
    obtenerPorSession: new ObtenerConversationContextContextoPorSession(contextRepository)
  });

  const botLogController = new BotLogController({
    registrar: new RegistrarBotLog(botLogRepository),
    listarPorSession: new ListarBotLogsPorSession(botLogRepository)
  });

  const crearAppointmentUseCase = new CrearAppointment({
    appointment: appointmentRepository,
    doctor: doctorRepository,
    patient: patientRepository,
    schedule: doctorScheduleRepository,
    blocking: scheduleBlockRepository,
    specialty: specialtyRepository,
    branch: branchRepository,
    office: officeRepository,
    status: appointmentRepository
  });

  const disponibilidadUseCase = new ObtenerDisponibilidadMedico(
    appointmentRepository,
    doctorScheduleRepository,
    scheduleBlockRepository,
    doctorRepository
  );

  const webhookController = new WebhookController({
    recibirWhatsappWebhook: new RecibirWhatsappWebhook(
      rawEventRepository,
      chatMessageRepository,
      webhookLogRepository,
      externalWhatsappService,
      botMenuRepository,
      botMenuOptionRepository,
      patientRepository,
      chatSessionRepository,
      specialtyRepository,
      contextRepository,
      doctorRepository,
      crearAppointmentUseCase,
      disponibilidadUseCase,
      appointmentRepository,
      medicalPrescriptionRepository,
      groqMedicalAssistantService,
      prescriptionPdfService,
      externalWhatsappMediaService
    )
  });

  app.use("/api/chatbot/chat-messages", ChatMessageRoutes(chatMessageController));
  app.use("/api/chatbot/message-delivery-logs", MessageDeliveryLogRoutes(deliveryController));
  app.use("/api/chatbot/conversation-contexts", ConversationContextRoutes(contextController));
  app.use("/api/chatbot/bot-logs", BotLogRoutes(botLogController));
  app.use("/api/chatbot/webhooks", WebhookRoutes(webhookController));
};
