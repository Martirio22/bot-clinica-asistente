# HX ODM JS Clínica

Base en JavaScript CommonJS con arquitectura hexagonal sencilla, usando únicamente módulos alineados al modelo de base enviado para el sistema de reservas médicas por WhatsApp.

Incluye:

- MongoDB con Mongoose.
- PostgreSQL con Sequelize Code First.
- Módulo `Security` en PostgreSQL: `users`, `roles`, `user_roles`, `refresh_tokens`.
- Autenticación JWT con access token y refresh token.
- Middleware Bearer token.
- Ejemplo MongoDB ↔ MongoDB: `chat_messages` y `message_delivery_logs` usando `ObjectId` + `ref` + `populate`.
- Ejemplo PostgreSQL ↔ MongoDB: `chatSessionId`, `patientId`, `appointmentId` guardados como IDs string en Mongo y validados en caso de uso.
- Ejemplo de webhook protegido con `x-webhook-token`.

> Nota: se eliminó el módulo `src/lib/User` porque era solo un ejemplo académico. En este proyecto el usuario real del sistema es `src/lib/Security/Users`.

## Convenciones usadas

- Carpetas principales del patrón hexagonal: `Aplicacion`, `Dominio`, `Infraestructura`.
- Clases: PascalCase. Ejemplo: `CrearSecurityUser`.
- Métodos y variables: camelCase. Ejemplo: `firstName`, `passwordHash`.
- Modelos Mongoose/Sequelize: PascalCase. Ejemplo: `SecurityUserModel`.
- Colecciones MongoDB: snake_case plural. Ejemplo: `chat_messages`.
- Tablas PostgreSQL: snake_case plural. Ejemplo: `users`, `roles`, `user_roles`.
- Columnas PostgreSQL: snake_case. Ejemplo: `first_name`, `password_hash`.
- Propiedades JS: camelCase. Ejemplo: `firstName`, `passwordHash`.

## Inicio

```bash
npm install
copy .env.example .env
npm run dev
```

Con PostgreSQL en Docker:

```bash
docker compose up -d
```

## Rutas principales

Security PostgreSQL:

```txt
POST   /api/security/auth/register
POST   /api/security/auth/login
POST   /api/security/auth/refresh-token
POST   /api/security/auth/logout
GET    /api/security/auth/me

GET    /api/security/users
POST   /api/security/users
GET    /api/security/users/:id
PUT    /api/security/users/:id
DELETE /api/security/users/:id

GET    /api/security/roles
POST   /api/security/roles
GET    /api/security/roles/:id
PUT    /api/security/roles/:id
DELETE /api/security/roles/:id

POST   /api/security/user-roles
GET    /api/security/user-roles
GET    /api/security/user-roles/users/:userId/roles
DELETE /api/security/user-roles/users/:userId/roles/:roleId
```

ChatBot Mongo:

```txt
POST   /api/chatbot/chat-messages
GET    /api/chatbot/chat-messages/session/:chatSessionId
POST   /api/chatbot/message-delivery-logs
GET    /api/chatbot/message-delivery-logs/message/:chatMessageId
```

Webhook protegido:

```txt
POST /api/chatbot/webhooks/whatsapp
Header: x-webhook-token: token_interno_para_worker_whatsapp
```

## Relación de ejemplos incluidos

### PostgreSQL ↔ PostgreSQL

`users`, `roles` y `user_roles` se relacionan en:

```txt
src/lib/Security/Infraestructura/associations.js
```

### MongoDB ↔ MongoDB

`message_delivery_logs.chatMessageId` referencia a `chat_messages._id` con `ObjectId` + `ref`.

```txt
src/lib/ChatBot/MessageDeliveryLogs/Infraestructura/MessageDeliveryLogModel.js
```

### PostgreSQL ↔ MongoDB

MongoDB guarda IDs lógicos como string:

```txt
chat_messages.chatSessionId -> PostgreSQL chat_sessions.id
chat_messages.patientId -> PostgreSQL patients.id
chat_messages.appointmentId -> PostgreSQL appointments.id
```

La validación se debe hacer en casos de uso, por ejemplo:

```txt
src/lib/ChatBot/ChatMessages/Aplicacion/CrearChatMessage.js
```
