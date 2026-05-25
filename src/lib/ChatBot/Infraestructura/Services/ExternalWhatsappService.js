const axios = require('axios');

class ExternalWhatsappService {
  async enviarMensaje(payloadSaliente) {
    try {
      const url = 'http://localhost:3978/api/whatsapp/send-message';

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'WHATSAPP_API_TOKEN': 'token_interno_para_consumir_whatsapp'
        }
      };
      const response = await axios.post(url, payloadSaliente, config);
      return response.data;

    } catch (error) {
      if (error.response) {
        throw new Error(`No se pudo enviar el mensaje por WhatsApp: Request failed with status code ${error.response.status}`);
      }
      throw new Error(`No se pudo conectar con el servicio de WhatsApp: ${error.message}`);
    }
  }
}

module.exports = ExternalWhatsappService;