# Ejemplos para probar

## Registrar usuario de seguridad

POST `http://localhost:3977/api/security/auth/register`

```json
{
  "firstName": "Carlos",
  "lastName": "Administrador",
  "email": "admin@clinica.com",
  "username": "admin",
  "password": "Admin123*",
  "phone": "0999999999"
}
```

## Login

POST `http://localhost:3977/api/security/auth/login`

```json
{
  "usernameOrEmail": "admin",
  "password": "Admin123*"
}
```

Usa el accessToken como Bearer en las rutas protegidas.

## Crear rol

POST `http://localhost:3977/api/security/roles`

```json
{
  "code": "RECEPCION",
  "name": "Recepción",
  "description": "Personal de recepción"
}
```

## Asignar rol a usuario

POST `http://localhost:3977/api/security/user-roles`

```json
{
  "userId": "uuid-del-usuario",
  "roleId": "uuid-del-rol"
}
```

## Crear mensaje Mongo con referencias lógicas a PostgreSQL

POST `http://localhost:3977/api/chatbot/chat-messages`

```json
{
  "chatSessionId": "uuid-session-postgres",
  "patientId": "uuid-patient-postgres",
  "whatsappLineId": "uuid-line-postgres",
  "sender": "PATIENT",
  "contentType": "TEXT",
  "messageText": "Hola, quiero agendar una cita",
  "whatsappMessageId": "WA_MSG_001",
  "metadata": {
    "source": "whatsapp-web.js"
  }
}
```

## Crear log de entrega Mongo ↔ Mongo

POST `http://localhost:3977/api/chatbot/message-delivery-logs`

```json
{
  "chatMessageId": "object-id-del-chat-message",
  "chatSessionId": "uuid-session-postgres",
  "whatsappMessageId": "WA_MSG_001",
  "status": "SENT"
}
```

## Webhook WhatsApp protegido

POST `http://localhost:3977/api/chatbot/webhooks/whatsapp`

Header:

```txt
x-webhook-token: token_interno_para_worker_whatsapp
```

Body:

```json
{
  "eventType": "MESSAGE_RECEIVED",
  "from": "593987654321",
  "chatSessionId": "uuid-session-postgres",
  "patientId": "uuid-patient-postgres",
  "sender": "PATIENT",
  "contentType": "TEXT",
  "messageText": "Necesito una cita médica",
  "whatsappMessageId": "WA_MSG_002"
}
```
