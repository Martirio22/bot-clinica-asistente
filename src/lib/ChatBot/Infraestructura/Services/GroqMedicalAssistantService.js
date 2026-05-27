const axios = require("axios");

class GroqMedicalAssistantService {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY;
        this.model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
        this.baseUrl = "https://api.groq.com/openai/v1/chat/completions";
    }

    async recomendarEspecialista({ symptoms }) {
        if (!this.apiKey) {
            throw new Error("GROQ_API_KEY no está configurado");
        }

        const promptSistema = [
            "Eres un asistente médico virtual para orientación inicial.",
            "Tu tarea es recomendar una especialidad médica probable según los síntomas del paciente.",
            "No diagnostiques de forma definitiva.",
            "No reemplazas una consulta médica.",
            "Si hay síntomas de alarma, recomienda acudir a emergencias inmediatamente.",
            "Responde en español, claro y breve.",
            "Formato obligatorio:",
            "Especialidad sugerida: ...",
            "Motivo: ...",
            "Nivel de urgencia: BAJA | MEDIA | ALTA | EMERGENCIA",
            "Recomendación: ...",
            "Aviso: Esta orientación no reemplaza una valoración médica profesional."
        ].join("\n");

        const promptUsuario = [
            "Síntomas del paciente:",
            symptoms
        ].join("\n");

        const response = await axios.post(
            this.baseUrl,
            {
                model: this.model,
                messages: [
                    { role: "system", content: promptSistema },
                    { role: "user", content: promptUsuario }
                ],
                temperature: 0.2,
                max_tokens: 500
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`
                },
                timeout: 20000
            }
        );

        const text = response.data?.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error("La IA no devolvió una respuesta válida");
        }

        return text.trim();
    }
}

module.exports = GroqMedicalAssistantService;