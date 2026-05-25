const axios = require("axios");

class ExternalWhatsappService {
  constructor() {
    this.baseUrl = process.env.WHATSAPP_SERVICE_URL || "http://localhost:3978/api/whatsapp";
  }

  /**
   * @param {Object} data 
   * @returns {Promise<Object>} Respuesta del servicio de WhatsApp
   */
  async enviarMensaje(data) {
    try {
      const payload = {
        to: data.to,
        whatsappLineId: data.whatsappLineId || "line-main",
        type: data.type || "TEXT",
        message: data.message
      };

      const response = await axios.post(`${this.baseUrl}/send-message`, payload);

      return response.data;

    } catch (error) {
      console.error("Error consumiendo el servicio externo de WhatsApp:", error.response?.data || error.message);
      throw new Error(`No se pudo enviar el mensaje por WhatsApp: ${error.message}`);
    }
  }
}

module.exports = ExternalWhatsappService;