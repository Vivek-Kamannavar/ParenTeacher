# report_styles.py
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.pdfgen import canvas

# Palette definition
PRIMARY = HexColor("#1E3A8A")       # Deep Navy
PRIMARY_LIGHT = HexColor("#EFF6FF") # Soft Blue Background
SECONDARY = HexColor("#2563EB")     # Bright Slate Blue
ACCENT = HexColor("#0D9488")        # Deep Teal
TEXT_DARK = HexColor("#0F172A")     # Dark Slate / Charcoal for crisp readability
TEXT_MUTED = HexColor("#475569")    # Subdued Slate for metadata
BORDER_COLOR = HexColor("#CBD5E1")  # Clean Border Grey
BG_LIGHT = HexColor("#F8FAFC")      # Light Card Background
SUCCESS = HexColor("#16A34A")       # Pass / Success Green
DANGER = HexColor("#DC2626")        # Fail / Error Red
WARNING = HexColor("#D97706")       # Warning Amber

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas that accumulates page states and draws running headers
    and footers ('Page X of Y') on all pages except the front cover and certificate.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, total_pages):
        # Suppress headers and footers on Cover (Page 1) and Certificate (Page 2)
        if self._pageNumber > 2:
            self.saveState()
            
            # Running Header
            self.setStrokeColor(HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(48, 750, 612 - 48, 750)
            
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(HexColor("#1E3A8A"))
            self.drawString(48, 754, "PARENTEACHER")
            
            self.setFont("Helvetica", 8)
            self.setFillColor(HexColor("#64748B"))
            self.drawString(130, 754, "|  Institutional Academic Governance & Parent Collaboration Platform")
            
            self.drawRightString(612 - 48, 754, "TECHNICAL PROJECT REPORT")
            
            # Running Footer
            self.setStrokeColor(HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(48, 42, 612 - 48, 42)
            
            self.setFont("Helvetica", 8)
            self.setFillColor(HexColor("#64748B"))
            self.drawString(48, 30, "Department of Computer Science & Engineering  |  Bachelor of Engineering")
            
            page_text = f"Page {self._pageNumber} of {total_pages}"
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(HexColor("#1E3A8A"))
            self.drawRightString(612 - 48, 30, page_text)
            
            self.restoreState()


def get_report_styles():
    base = getSampleStyleSheet()
    styles = {}

    styles['CoverTitle'] = ParagraphStyle(
        'CoverTitle',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        alignment=1, # Center
        textColor=PRIMARY
    )
    
    styles['CoverSubtitle'] = ParagraphStyle(
        'CoverSubtitle',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        alignment=1,
        textColor=SECONDARY
    )

    styles['CoverDesc'] = ParagraphStyle(
        'CoverDesc',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=1,
        textColor=TEXT_DARK
    )

    styles['CoverMeta'] = ParagraphStyle(
        'CoverMeta',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        alignment=1,
        textColor=TEXT_MUTED
    )

    styles['ChapterTitle'] = ParagraphStyle(
        'ChapterTitle',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY,
        spaceAfter=6
    )

    styles['SectionTitle'] = ParagraphStyle(
        'SectionTitle',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=SECONDARY,
        spaceBefore=5,
        spaceAfter=3
    )

    styles['SubsectionTitle'] = ParagraphStyle(
        'SubsectionTitle',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=PRIMARY,
        spaceBefore=4,
        spaceAfter=2
    )

    styles['Body'] = ParagraphStyle(
        'Body',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK,
        alignment=4, # Justify
        spaceAfter=4
    )

    styles['BodyBold'] = ParagraphStyle(
        'BodyBold',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK,
        spaceAfter=4
    )

    styles['Bullet'] = ParagraphStyle(
        'Bullet',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        textColor=TEXT_DARK,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2.5
    )

    styles['TableHeader'] = ParagraphStyle(
        'TableHeader',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10,
        textColor=HexColor('#FFFFFF'),
        alignment=1
    )

    styles['TableCell'] = ParagraphStyle(
        'TableCell',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=TEXT_DARK
    )

    styles['TableCellBold'] = ParagraphStyle(
        'TableCellBold',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=TEXT_DARK
    )

    styles['TableCellCenter'] = ParagraphStyle(
        'TableCellCenter',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=TEXT_DARK,
        alignment=1
    )

    styles['PassBadge'] = ParagraphStyle(
        'PassBadge',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=SUCCESS,
        alignment=1
    )

    styles['FailBadge'] = ParagraphStyle(
        'FailBadge',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=DANGER,
        alignment=1
    )

    styles['CalloutText'] = ParagraphStyle(
        'CalloutText',
        parent=base['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.2,
        leading=11.5,
        textColor=PRIMARY
    )

    styles['FigureCaption'] = ParagraphStyle(
        'FigureCaption',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        alignment=1,
        textColor=TEXT_MUTED,
        spaceBefore=3,
        spaceAfter=4
    )

    styles['CodeSnippet'] = ParagraphStyle(
        'CodeSnippet',
        parent=base['Normal'],
        fontName='Courier',
        fontSize=7.2,
        leading=9.5,
        textColor=HexColor('#1E293B')
    )

    return styles

def create_callout(text, styles, width=516):
    """Generates an elegant highlighted callout card."""
    p = Paragraph(text, styles['CalloutText'])
    t = Table([[p]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#F0F7FF')),
        ('LINELEFT', (0,0), (-1,-1), 3.5, SECONDARY),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t
