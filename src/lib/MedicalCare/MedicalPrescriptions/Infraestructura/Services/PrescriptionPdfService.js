const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// ── Color palette ──────────────────────────────────────────────────────────────
const C = {
    primary:   "#1A3C5E",   // Deep navy
    accent:    "#2E7D9A",   // Teal
    lightBg:   "#EAF4F8",   // Light teal background
    divider:   "#C5DDE8",   // Divider / borders
    textDark:  "#1A1A2E",   // Near-black
    textMid:   "#4A5568",   // Medium gray
    white:     "#FFFFFF",
    gold:      "#D4A853",   // Gold for highlights
    goldBg:    "#FFF8EC",   // Gold-tinted background
};

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
            const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: true });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            const W = doc.page.width;   // 595.28
            const H = doc.page.height;  // 841.89
            const ML = 45;              // left margin for content
            const MR = 45;              // right margin for content
            const CW = W - ML - MR;    // content width

            // ── Extract data ─────────────────────────────────────────────────
            const patient   = prescription.medicalAttention?.patient;
            const doctor    = prescription.medicalAttention?.doctor;
            const doctorUser = doctor?.user;

            const patientName = patient
                ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
                : "Paciente no registrado";
            const doctorName = doctorUser
                ? `${doctorUser.firstName || ""} ${doctorUser.lastName || ""}`.trim()
                : "Médico no registrado";

            // ── HEADER ───────────────────────────────────────────────────────
            // Navy bar
            doc.rect(0, 0, W, 75).fill(C.primary);
            // Teal accent strip below header
            doc.rect(0, 75, W, 3).fill(C.accent);

            // Clinic name
            doc.fillColor(C.white).font("Helvetica-Bold").fontSize(18)
                .text("CLÍNICA MÉDICA", ML, 18, { width: CW * 0.7 });
            doc.fillColor(C.divider).font("Helvetica").fontSize(9)
                .text("Sistema de Gestión Clínica  ·  www.clinica.com", ML, 42, { width: CW * 0.7 });

            // Cross symbol (right of header)
            doc.fillColor(C.white).font("Helvetica-Bold").fontSize(34)
                .text("+", W - 65, 18, { width: 40, align: "center" });

            // Left & right side decorative stripes
            doc.rect(0, 78, 5, H - 123).fill(C.lightBg);
            doc.rect(W - 5, 78, 5, H - 123).fill(C.lightBg);

            // ── FOOTER ───────────────────────────────────────────────────────
            doc.rect(0, H - 45, W, 45).fill(C.primary);
            doc.rect(0, H - 48, W, 3).fill(C.accent);
            doc.fillColor(C.divider).font("Helvetica").fontSize(7.5)
                .text(
                    "Esta receta fue generada desde el sistema clínico  ·  Documento válido con firma y sello del médico",
                    0, H - 28, { align: "center", width: W }
                );
            doc.fillColor(C.gold).font("Helvetica-Bold").fontSize(7.5)
                .text("Pág. 1", W - 55, H - 28);

            // ── TITLE ────────────────────────────────────────────────────────
            let y = 95;
            doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(20)
                .text("RECETA MÉDICA", ML, y, { align: "center", width: CW });
            y += 26;
            doc.fillColor(C.textMid).font("Helvetica").fontSize(8.5)
                .text("Documento generado electrónicamente — válido con firma y sello", ML, y, { align: "center", width: CW });
            y += 22;

            // ── CODE & DATE CARD ─────────────────────────────────────────────
            const cardH = 42;
            doc.roundedRect(ML, y, CW, cardH, 4).fill(C.lightBg);
            doc.roundedRect(ML, y, CW, cardH, 4).stroke(C.divider);

            const col1W = CW * 0.60;
            // vertical divider
            doc.moveTo(ML + col1W, y + 6).lineTo(ML + col1W, y + cardH - 6)
                .stroke(C.divider);

            doc.fillColor(C.accent).font("Helvetica-Bold").fontSize(7)
                .text("CÓDIGO DE RECETA", ML + 12, y + 8);
            doc.fillColor(C.textDark).font("Helvetica").fontSize(9)
                .text(prescription.prescriptionCode || "Sin código", ML + 12, y + 20);

            doc.fillColor(C.accent).font("Helvetica-Bold").fontSize(7)
                .text("FECHA DE EMISIÓN", ML + col1W + 12, y + 8);
            doc.fillColor(C.textDark).font("Helvetica").fontSize(9)
                .text(this._formatDate(prescription.issueDate), ML + col1W + 12, y + 20);

            y += cardH + 14;

            // ── HELPER: section header ────────────────────────────────────────
            const sectionHeader = (label, yPos) => {
                doc.rect(ML, yPos, CW, 24).fill(C.primary);
                doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
                    .text(`▶  ${label}`, ML + 10, yPos + 7, { width: CW - 20 });
                return yPos + 24;
            };

            // ── HELPER: info card (2 columns) ─────────────────────────────────
            const infoCard = (label1, value1, label2, value2, yPos) => {
                const h = 40;
                doc.rect(ML, yPos, CW, h).fill(C.white);
                doc.rect(ML, yPos, CW, h).stroke(C.divider);
                doc.moveTo(ML + col1W, yPos + 4).lineTo(ML + col1W, yPos + h - 4).stroke(C.divider);

                doc.fillColor(C.accent).font("Helvetica-Bold").fontSize(7)
                    .text(label1, ML + 12, yPos + 7);
                doc.fillColor(C.textDark).font("Helvetica").fontSize(10)
                    .text(value1, ML + 12, yPos + 18, { width: col1W - 20, lineBreak: false });

                doc.fillColor(C.accent).font("Helvetica-Bold").fontSize(7)
                    .text(label2, ML + col1W + 12, yPos + 7);
                doc.fillColor(C.textDark).font("Helvetica").fontSize(10)
                    .text(value2, ML + col1W + 12, yPos + 18, { width: CW - col1W - 20, lineBreak: false });

                return yPos + h;
            };

            // ── PATIENT ───────────────────────────────────────────────────────
            y = sectionHeader("DATOS DEL PACIENTE", y);
            y = infoCard(
                "NOMBRE COMPLETO", patientName,
                "WHATSAPP", patient?.whatsappPhone || "No registrado",
                y
            );
            y += 14;

            // ── DOCTOR ────────────────────────────────────────────────────────
            y = sectionHeader("DATOS DEL MÉDICO", y);
            y = infoCard(
                "MÉDICO TRATANTE", doctorName,
                "REGISTRO PROFESIONAL", doctor?.professionalRegistry || "No registrado",
                y
            );
            y += 14;

            // ── MEDICATIONS ───────────────────────────────────────────────────
            y = sectionHeader("MEDICAMENTOS PRESCRITOS", y);
            y += 6;

            const items = (prescription.items || [])
                .filter(x => x.isActive)
                .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

            if (items.length === 0) {
                doc.fillColor(C.textMid).font("Helvetica").fontSize(10)
                    .text("No hay medicamentos registrados.", ML + 12, y);
                y += 20;
            } else {
                items.forEach((item, idx) => {
                    const rowBg = idx % 2 === 0 ? C.lightBg : C.white;

                    // Estimate row height
                    const hasInd = !!item.indications;
                    const rowH = hasInd ? 68 : 54;

                    doc.rect(ML, y, CW, rowH).fill(rowBg);
                    doc.rect(ML, y, CW, rowH).stroke(C.divider);

                    // Number badge
                    doc.rect(ML, y, 26, rowH).fill(C.accent);
                    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(13)
                        .text(String(item.order || idx + 1), ML, y + (rowH / 2) - 8, { width: 26, align: "center" });

                    const rx = ML + 34;
                    const rw = CW - 34;

                    // Medicine name
                    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(11)
                        .text((item.medicine || "Medicamento no registrado").toUpperCase(), rx, y + 8, { width: rw });

                    // Detail columns: Dosis | Frecuencia | Duración
                    const dw = rw / 3;
                    const dy = y + 24;

                    [
                        ["DOSIS",      item.dose      || "—"],
                        ["FRECUENCIA", item.frequency || "—"],
                        ["DURACIÓN",   item.duration  || "—"],
                    ].forEach(([lbl, val], i) => {
                        const dx = rx + i * dw;
                        doc.fillColor(C.accent).font("Helvetica-Bold").fontSize(7)
                            .text(lbl, dx, dy, { width: dw - 4 });
                        doc.fillColor(C.textDark).font("Helvetica").fontSize(9)
                            .text(val, dx, dy + 10, { width: dw - 4 });
                    });

                    if (hasInd) {
                        doc.fillColor(C.textMid).font("Helvetica").fontSize(8.5)
                            .text(`Indicaciones: ${item.indications}`, rx, y + 50, { width: rw });
                    }

                    y += rowH + 3;
                });
            }

            y += 12;

            // ── GENERAL INDICATIONS ───────────────────────────────────────────
            if (prescription.generalIndications) {
                y = sectionHeader("INDICACIONES GENERALES", y);
                y += 1;

                const giLines = doc.heightOfString(
                    prescription.generalIndications,
                    { width: CW - 28, fontSize: 10 }
                );
                const giH = Math.max(40, giLines + 24);

                doc.rect(ML, y, CW, giH).fill(C.goldBg);
                doc.rect(ML, y, CW, giH).stroke(C.gold);
                // Gold left accent bar
                doc.rect(ML, y, 4, giH).fill(C.gold);

                doc.fillColor(C.textDark).font("Helvetica").fontSize(10)
                    .text(prescription.generalIndications, ML + 16, y + 12, { width: CW - 28 });

                y += giH + 18;
            }

            // ── SIGNATURE BLOCK ───────────────────────────────────────────────
            const sigColW = CW / 2;
            const sigY = y + 10;

            [0, 1].forEach(col => {
                const sx = ML + col * sigColW + sigColW * 0.1;
                const sw = sigColW * 0.8;
                // Signature line
                doc.moveTo(sx, sigY + 28).lineTo(sx + sw, sigY + 28).stroke(C.divider);

                const labels = [
                    ["Firma del Médico",    `Dr. ${doctorName}`],
                    ["Sello / Timbre",      `Reg. ${doctor?.professionalRegistry || ""}`],
                ];
                doc.fillColor(C.accent).font("Helvetica-Bold").fontSize(7.5)
                    .text(labels[col][0], sx, sigY + 32, { width: sw, align: "center" });
                doc.fillColor(C.textMid).font("Helvetica").fontSize(8.5)
                    .text(labels[col][1], sx, sigY + 44, { width: sw, align: "center" });
            });

            // vertical divider between sig columns
            const midX = ML + sigColW;
            doc.moveTo(midX, sigY + 10).lineTo(midX, sigY + 56).stroke(C.divider);

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
        if (isNaN(date.getTime())) return String(value);
        const yyyy = date.getFullYear();
        const mm   = String(date.getMonth() + 1).padStart(2, "0");
        const dd   = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }
}

module.exports = PrescriptionPdfService;