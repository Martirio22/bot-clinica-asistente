const axios = require('axios');

class ExternalWhatsappService {
  async enviarMensaje(payloadSaliente) {
    try {
      const url = process.env.WHATSAPP_API_URL;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-internal-token': process.env.WHATSAPP_API_TOKEN
        }
      };

      const response = await axios.post(url, payloadSaliente, config);

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error WhatsApp response:', {
          status: error.response.status,
          data: error.response.data
        });

        throw new Error(
          `No se pudo enviar el mensaje por WhatsApp: Request failed with status code ${error.response.status}`
        );
      }

      throw new Error(`No se pudo conectar con el servicio de WhatsApp: ${error.message}`);
    }
  }
}

module.exports = ExternalWhatsappService;