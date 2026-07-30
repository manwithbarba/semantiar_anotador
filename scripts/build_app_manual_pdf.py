from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Manual_de_uso_SemantIAr_App.pdf"


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D8E1EC"))
    canvas.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#68758A"))
    canvas.drawString(18 * mm, 9 * mm, "SemantIAr App - versión tester académica")
    canvas.drawRightString(192 * mm, 9 * mm, f"Página {doc.page}")
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="ManualTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=29,
            textColor=colors.HexColor("#163B63"),
            alignment=TA_CENTER,
            spaceAfter=5 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ManualSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#5D6B80"),
            alignment=TA_CENTER,
            spaceAfter=8 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ManualHeading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=19,
            textColor=colors.HexColor("#1E5D96"),
            spaceBefore=5 * mm,
            spaceAfter=2.5 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ManualBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#24344D"),
            spaceAfter=2.5 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ManualBullet",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            leftIndent=6 * mm,
            firstLineIndent=-3.5 * mm,
            textColor=colors.HexColor("#24344D"),
            spaceAfter=1.7 * mm,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ManualNotice",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=14,
            borderColor=colors.HexColor("#D3A42D"),
            borderWidth=1,
            borderPadding=8,
            backColor=colors.HexColor("#FFF8E3"),
            textColor=colors.HexColor("#624A08"),
            spaceAfter=6 * mm,
        )
    )

    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=17 * mm,
        bottomMargin=20 * mm,
        title="Manual de uso de SemantIAr App",
        author="Proyecto SEMANTIAR",
        subject="Guía operativa para anotadores clínicos",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates(PageTemplate(id="manual", frames=[frame], onPage=footer))

    story = [
        Spacer(1, 5 * mm),
        Paragraph("SemantIAr App", styles["ManualTitle"]),
        Paragraph(
            "Manual de uso para Android y PWA · Versión tester · Uso exclusivamente académico",
            styles["ManualSubtitle"],
        ),
        Paragraph(
            "SemantIAr App permite revisar notas clínicas, registrar formas breves y "
            "codificar conceptos con SNOMED CT. No es software médico y no debe utilizarse "
            "para decisiones asistenciales. Cargue únicamente archivos provistos por el "
            "equipo de investigación y sin datos identificatorios de pacientes.",
            styles["ManualNotice"],
        ),
    ]

    sections = [
        (
            "1. Instalar o abrir la aplicación",
            [
                "Android: descargue el APK tester desde GitHub Releases, abra el archivo y "
                "autorice la instalación desde esa fuente si el sistema lo solicita.",
                "Las actualizaciones del APK son manuales: descargue e instale cada nueva "
                "versión publicada.",
                "PWA: abra https://manwithbarba.github.io/semantiar_anotador/ en Chrome y "
                "elija Instalar aplicación o Agregar a pantalla principal.",
            ],
        ),
        (
            "2. Cargar el JSON asignado",
            [
                "Pulse Cargar archivo JSON y seleccione exclusivamente el archivo de su ID "
                "de anotador.",
                "Compruebe que aparezcan las notas y el contador de progreso.",
                "Puede cargar un JSON nuevo o un JSON de avance descargado anteriormente.",
            ],
        ),
        (
            "3. Revisar cada nota",
            [
                "Use Ir a una nota para cambiar de caso y los accesos Nota, Formas, "
                "Conceptos y Cierre para avanzar sin desplazamientos largos.",
                "Lea el texto completo. Los resaltados son candidatos: acéptelos, "
                "descártelos o ajuste sus límites.",
                "Para incorporar una mención omitida, seleccione su expresión exacta en la "
                "nota y use la acción de incorporación.",
                "En lotes sin preanotaciones, agregue las menciones desde cero.",
            ],
        ),
        (
            "4. Revisar formas breves",
            [
                "Decida cada abreviatura, sigla o acrónimo según su contexto local.",
                "Registre cómo está escrita, si su significado puede resolverse, su función "
                "y su sección cuando corresponda.",
                "Complete todas las tarjetas y confirme la revisión de formas.",
                "No adivine: ambigüedad y abstención son decisiones válidas cuando el texto "
                "no permite resolver el significado.",
            ],
        ),
        (
            "5. Codificar conceptos clínicos",
            [
                "Elija la jerarquía: Hallazgo clínico, Procedimiento o Fármaco.",
                "Busque y seleccione el concepto SNOMED CT.",
                "Verifique el texto literal y complete polaridad, certeza, temporalidad y "
                "sujeto.",
                "La selección queda registrada inmediatamente en la sesión.",
            ],
        ),
        (
            "6. Cerrar la nota",
            [
                "Elija Revisada con conceptos si codificó conceptos, o Sin conceptos "
                "anotables si no existen conceptos elegibles.",
                "El contador disminuye solamente al cerrar la nota.",
                "Si modifica una nota cerrada, vuelve a pendiente y debe cerrarla otra vez.",
            ],
        ),
        (
            "7. Guardar, continuar y entregar",
            [
                "Pulse Guardar avance con frecuencia. Android abre el selector del sistema; "
                "la web descarga el JSON.",
                "Para continuar otro día, vuelva a cargar el último JSON de avance.",
                "Cuando todas las notas estén cerradas, descargue el JSON final y envíelo "
                "al responsable del estudio.",
                "La aplicación no guarda anotaciones en GitHub ni en un servidor propio.",
            ],
        ),
        (
            "8. Solución de problemas",
            [
                "El contador no disminuye: complete las decisiones y cierre la nota.",
                "No puede cerrar: revise formas breves pendientes y confirme su revisión.",
                "Falta una mención: selecciónela en el texto e incorpórela manualmente.",
                "Perdió el avance: cargue el último JSON descargado.",
                "La búsqueda no responde: compruebe la conexión y comunique la incidencia "
                "si el problema continúa.",
            ],
        ),
        (
            "9. Privacidad y alcance",
            [
                "No cargue nombres, documentos, direcciones ni identificadores de pacientes.",
                "La búsqueda terminológica puede requerir conexión aunque la PWA instalada "
                "pueda abrirse sin red.",
                "SemantIAr App es una versión tester pública, en actualización continua y "
                "destinada exclusivamente a investigación y docencia.",
            ],
        ),
    ]

    for heading, bullets in sections:
        block = [Paragraph(heading, styles["ManualHeading"])]
        block.extend(Paragraph(f"- {item}", styles["ManualBullet"]) for item in bullets)
        story.append(KeepTogether(block))

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
