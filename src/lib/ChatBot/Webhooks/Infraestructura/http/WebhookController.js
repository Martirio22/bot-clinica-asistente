class WebhookController {
    constructor({ recibirWhatsappWebhook }) {
        this.recibirWhatsappWebhook = recibirWhatsappWebhook;
    }

    recibirWhatsapp = async (req, res) => {
        const data = await this.recibirWhatsappWebhook.ejecutar(req.body);

        return res.status(200).json(data);
    };
}

module.exports = WebhookController;