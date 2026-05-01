class WebhookController { constructor({ recibirWhatsappWebhook }){this.recibirWhatsappWebhook=recibirWhatsappWebhook;} recibirWhatsapp = async (req,res) => { const data=await this.recibirWhatsappWebhook.ejecutar(req.body); res.status(200).json({success:true,data}); }; }
module.exports = WebhookController;
