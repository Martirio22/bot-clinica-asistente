const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

class PrescriptionPdfService {
    constructor() {
        this.outputDir = path.join(process.cwd(), "public", "prescriptions");
    }

    async generarPdf(prescription) {
        if (!prescription) {
            throw new Error("Receta requerida para generar PDF");
        }

        await fs.promises.mkdir(this.outputDir, { recursive: true });

        const fileName = `receta_${prescription.prescriptionCode || prescription.id}.pdf`
            .replace(/[^\w.-]/g, "_");

        const filePath = path.join(this.outputDir, fileName);

        await new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: "A4",
                margin: 50
            });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            const patient = prescription.medicalAttention?.patient;
            const doctor = prescription.medicalAttention?.doctor;
            const doctorUser = doctor?.user;

            const patientName = patient
                ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
                : "Paciente no registrado";

            const doctorName = doctorUser
                ? `${doctorUser.firstName || ""} ${doctorUser.lastName || ""}`.trim()
                : "Médico no registrado";

            doc
                .fontSize(18)
                .text("RECETA MÉDICA", { align: "center" })
                .moveDown();

            doc
                .fontSize(11)
                .text(`Código: ${prescription.prescriptionCode || "Sin código"}`)
                .text(`Fecha: ${this._formatDate(prescription.issueDate)}`)
                .moveDown();

            doc
                .fontSize(13)
                .text("Datos del paciente", { underline: true })
                .fontSize(11)
                .text(`Paciente: ${patientName}`)
                .text(`WhatsApp: ${patient?.whatsappPhone || "No registrado"}`)
                .moveDown();

            doc
                .fontSize(13)
                .text("Datos del médico", { underline: true })
                .fontSize(11)
                .text(`Médico: ${doctorName}`)
                .text(`Registro profesional: ${doctor?.professionalRegistry || "No registrado"}`)
                .moveDown();

            doc
                .fontSize(13)
                .text("Medicamentos", { underline: true })
                .moveDown(0.5);

            const items = (prescription.items || [])
                .filter((x) => x.isActive)
                .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

            if (items.length === 0) {
                doc.fontSize(11).text("No hay medicamentos registrados.");
            } else {
                items.forEach((item, index) => {
                    doc
                        .fontSize(11)
                        .text(`${index + 1}. ${item.medicine || "Medicamento no registrado"}`, {
                            continued: false
                        })
                        .text(`   Dosis: ${item.dose || "No registrada"}`)
                        .text(`   Frecuencia: ${item.frequency || "No registrada"}`)
                        .text(`   Duración: ${item.duration || "No registrada"}`);

                    if (item.indications) {
                        doc.text(`   Indicaciones: ${item.indications}`);
                    }

                    doc.moveDown(0.7);
                });
            }

            if (prescription.generalIndications) {
                doc
                    .moveDown()
                    .fontSize(13)
                    .text("Indicaciones generales", { underline: true })
                    .fontSize(11)
                    .text(prescription.generalIndications)
                    .moveDown();
            }

            doc
                .moveDown(2)
                .fontSize(10)
                .text("Esta receta fue generada desde el sistema clínico.", { align: "center" });

            doc.end();

            stream.on("finish", resolve);
            stream.on("error", reject);
        });

        return {
            fileName,
            filePath,
            relativeUrl: `/public/prescriptions/${fileName}`
        };
    }

    _formatDate(value) {
        if (!value) return "Fecha no registrada";

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return String(value);
        }

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;
    }
}

module.exports = PrescriptionPdfService;