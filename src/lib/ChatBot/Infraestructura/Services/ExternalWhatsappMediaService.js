const axios = require("axios");

class ExternalWhatsappMediaService {
    constructor() {
        this.baseUrl = process.env.WHATSAPP_MEDIA_API_URL || "http://localhost:3978/api/whatsapp/mensajes/media-url";
        this.token = process.env.WHATSAPP_API_TOKEN;
    }

    async enviarMediaUrl({ to, whatsappLineId, url, caption }) {
        if (!to) throw new Error("to requerido");
        if (!whatsappLineId) throw new Error("whatsappLineId requerido");
        if (!url) throw new Error("url requerida");

        const response = await axios.post(
            this.baseUrl,
            {
                lineaId: whatsappLineId,
                telefono: to,
                url,
                caption: caption || ""
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-token": this.token
                },
                timeout: 20000
            }
        );

        return response.data;
    }
}

module.exports = ExternalWhatsappMediaService;