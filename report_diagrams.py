# report_diagrams.py
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon, Circle, Group
from reportlab.lib.colors import HexColor

# Color definitions for diagrams
C_NAVY = HexColor("#1E3A8A")
C_BLUE = HexColor("#2563EB")
C_LIGHT_BLUE = HexColor("#EFF6FF")
C_BORDER_BLUE = HexColor("#3B82F6")
C_TEXT = HexColor("#0F172A")
C_MUTED = HexColor("#475569")
C_STORE = HexColor("#FEF3C7")
C_STORE_BORDER = HexColor("#D97706")
C_REL_FILL = HexColor("#F0FDF4")
C_REL_BORDER = HexColor("#16A34A")

def draw_arrow(d, x1, y1, x2, y2, color=C_MUTED, label=""):
    """Draws a directional arrow with an optional floating label."""
    d.add(Line(x1, y1, x2, y2, strokeColor=color, strokeWidth=1.2))
    # Simple arrowhead
    dx = x2 - x1
    dy = y2 - y1
    dist = max((dx*dx + dy*dy)**0.5, 0.001)
    ux = dx / dist
    uy = dy / dist
    
    # Perpendicular
    px = -uy
    py = ux
    arrow_size = 5.0
    
    ax1 = x2 - ux * arrow_size + px * 3.0
    ay1 = y2 - uy * arrow_size + py * 3.0
    ax2 = x2 - ux * arrow_size - px * 3.0
    ay2 = y2 - uy * arrow_size - py * 3.0
    
    d.add(Polygon([x2, y2, ax1, ay1, ax2, ay2], fillColor=color, strokeColor=color))
    if label:
        lx = (x1 + x2) / 2
        ly = (y1 + y2) / 2 + 3
        d.add(String(lx, ly, label, fontName="Helvetica", fontSize=6.5, fillColor=C_MUTED, textAnchor="middle"))

def create_dfd0_drawing(w=516, h=220):
    """Generates DFD Level 0 Context Diagram."""
    d = Drawing(w, h)
    
    # Outer container border
    d.add(Rect(0, 0, w, h, fillColor=HexColor("#FAFAFA"), strokeColor=HexColor("#E2E8F0"), strokeWidth=0.8, rx=6, ry=6))
    
    # Central Process: 0.0 ParenTeacher Portal
    cx, cy = w / 2, h / 2
    d.add(Circle(cx, cy, 52, fillColor=C_NAVY, strokeColor=C_BLUE, strokeWidth=2))
    d.add(String(cx, cy + 16, "0.0 PARENTEACHER", fontName="Helvetica-Bold", fontSize=8.5, fillColor=HexColor("#FFFFFF"), textAnchor="middle"))
    d.add(String(cx, cy + 3, "Central Academic &", fontName="Helvetica", fontSize=8, fillColor=HexColor("#E0E7FF"), textAnchor="middle"))
    d.add(String(cx, cy - 10, "Parent Collaboration", fontName="Helvetica", fontSize=8, fillColor=HexColor("#E0E7FF"), textAnchor="middle"))
    d.add(String(cx, cy - 23, "System Engine", fontName="Helvetica", fontSize=7.5, fillColor=HexColor("#93C5FD"), textAnchor="middle"))
    
    # Entity 1: Student / Applicant (Top-Left)
    d.add(Rect(20, 150, 110, 48, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BORDER_BLUE, strokeWidth=1.2))
    d.add(String(75, 178, "STUDENT / APPLICANT", fontName="Helvetica-Bold", fontSize=7.5, fillColor=C_NAVY, textAnchor="middle"))
    d.add(String(75, 166, "[External Entity]", fontName="Helvetica-Oblique", fontSize=6.5, fillColor=C_MUTED, textAnchor="middle"))
    d.add(String(75, 155, "Admissions & Inquiries", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT, textAnchor="middle"))

    # Entity 2: Parent / Guardian (Bottom-Left)
    d.add(Rect(20, 25, 110, 48, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BORDER_BLUE, strokeWidth=1.2))
    d.add(String(75, 53, "PARENT / GUARDIAN", fontName="Helvetica-Bold", fontSize=7.5, fillColor=C_NAVY, textAnchor="middle"))
    d.add(String(75, 41, "[External Entity]", fontName="Helvetica-Oblique", fontSize=6.5, fillColor=C_MUTED, textAnchor="middle"))
    d.add(String(75, 30, "Monitors Progress & Alerts", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT, textAnchor="middle"))

    # Entity 3: Faculty / Teacher (Top-Right)
    d.add(Rect(386, 150, 110, 48, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BORDER_BLUE, strokeWidth=1.2))
    d.add(String(441, 178, "FACULTY / TEACHER", fontName="Helvetica-Bold", fontSize=7.5, fillColor=C_NAVY, textAnchor="middle"))
    d.add(String(441, 166, "[External Entity]", fontName="Helvetica-Oblique", fontSize=6.5, fillColor=C_MUTED, textAnchor="middle"))
    d.add(String(441, 155, "Attendance, Marks, Behavior", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT, textAnchor="middle"))

    # Entity 4: College Administrator (Bottom-Right)
    d.add(Rect(386, 25, 110, 48, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BORDER_BLUE, strokeWidth=1.2))
    d.add(String(441, 53, "COLLEGE ADMIN", fontName="Helvetica-Bold", fontSize=7.5, fillColor=C_NAVY, textAnchor="middle"))
    d.add(String(441, 41, "[External Entity]", fontName="Helvetica-Oblique", fontSize=6.5, fillColor=C_MUTED, textAnchor="middle"))
    d.add(String(441, 30, "Approvals, UUCMS, Notices", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT, textAnchor="middle"))

    # Data flows Student -> System
    draw_arrow(d, 130, 170, 210, 135, C_BLUE, "Application & Docs")
    draw_arrow(d, 210, 125, 130, 160, C_MUTED, "Status & UUCMS Ref")

    # Data flows Parent -> System
    draw_arrow(d, 130, 50, 210, 85, C_BLUE, "Auth (Aadhaar/OTP)")
    draw_arrow(d, 210, 95, 130, 60, C_MUTED, "Attendance & Scorecards")

    # Data flows Teacher -> System
    draw_arrow(d, 386, 170, 306, 135, C_BLUE, "Submit Attendance / Marks")
    draw_arrow(d, 306, 125, 386, 160, C_MUTED, "Student Rosters")

    # Data flows Admin -> System
    draw_arrow(d, 386, 50, 306, 85, C_BLUE, "Admission Decisions")
    draw_arrow(d, 306, 95, 386, 60, C_MUTED, "Audit & Institutional Logs")

    return d

def create_dfd1_drawing(w=516, h=250):
    """Generates DFD Level 1 Detailed Process Decomposition Diagram."""
    d = Drawing(w, h)
    d.add(Rect(0, 0, w, h, fillColor=HexColor("#FAFAFA"), strokeColor=HexColor("#E2E8F0"), strokeWidth=0.8, rx=6, ry=6))
    
    # 6 Core Processes (Rounded Rectangles)
    procs = [
        ("1.0 Admission &\nVerification", 30, 185, 115, 42),
        ("2.0 Identity &\nRole Access (RBAC)", 195, 185, 125, 42),
        ("3.0 Attendance &\nEligibility Engine", 365, 185, 125, 42),
        ("4.0 Assessment &\nInternal Marks", 30, 60, 115, 42),
        ("5.0 Behavior &\nDiscipline Tracking", 195, 60, 125, 42),
        ("6.0 Broadcast &\nNotification Bus", 365, 60, 125, 42)
    ]
    
    for title, x, y, pw, ph in procs:
        d.add(Rect(x, y, pw, ph, rx=5, ry=5, fillColor=C_LIGHT_BLUE, strokeColor=C_BLUE, strokeWidth=1.2))
        lines = title.split("\n")
        if len(lines) == 2:
            d.add(String(x + pw/2, y + 25, lines[0], fontName="Helvetica-Bold", fontSize=7.5, fillColor=C_NAVY, textAnchor="middle"))
            d.add(String(x + pw/2, y + 13, lines[1], fontName="Helvetica-Bold", fontSize=7.5, fillColor=C_NAVY, textAnchor="middle"))
        else:
            d.add(String(x + pw/2, y + 20, title, fontName="Helvetica-Bold", fontSize=7.5, fillColor=C_NAVY, textAnchor="middle"))

    # Central Data Stores (Parallel Bars)
    stores = [
        ("D1: Admissions Store", 45, 125, 105, 20),
        ("D2: Users & Credentials", 205, 125, 105, 20),
        ("D3: Academic Records", 375, 125, 105, 20)
    ]
    for name, sx, sy, sw, sh in stores:
        d.add(Rect(sx, sy, sw, sh, fillColor=C_STORE, strokeColor=C_STORE_BORDER, strokeWidth=1))
        # Top and bottom line emphasis for open store
        d.add(Line(sx, sy, sx+sw, sy, strokeColor=C_STORE_BORDER, strokeWidth=1.5))
        d.add(Line(sx, sy+sh, sx+sw, sy+sh, strokeColor=C_STORE_BORDER, strokeWidth=1.5))
        d.add(String(sx + sw/2, sy + 6, name, fontName="Helvetica-Bold", fontSize=7, fillColor=HexColor("#78350F"), textAnchor="middle"))

    # Interconnecting Data Flow Arrows
    draw_arrow(d, 87, 185, 87, 145, C_BLUE, "Store Verified App")
    draw_arrow(d, 257, 185, 257, 145, C_BLUE, "Token & Hash")
    draw_arrow(d, 427, 185, 427, 145, C_BLUE, "Save Class Log")
    draw_arrow(d, 87, 125, 87, 102, C_MUTED, "Read Roster")
    draw_arrow(d, 257, 125, 257, 102, C_MUTED, "Fetch Ward")
    draw_arrow(d, 427, 125, 427, 102, C_MUTED, "Dispatch Alert")
    draw_arrow(d, 150, 206, 195, 206, C_MUTED, "Registered Student")
    draw_arrow(d, 320, 206, 365, 206, C_MUTED, "Class Roster")
    draw_arrow(d, 145, 81, 195, 81, C_MUTED, "Student Link")
    draw_arrow(d, 320, 81, 365, 81, C_MUTED, "Trigger Notice")

    return d

def create_er_drawing(w=516, h=250):
    """Generates Entity-Relationship Diagram."""
    d = Drawing(w, h)
    d.add(Rect(0, 0, w, h, fillColor=HexColor("#FAFAFA"), strokeColor=HexColor("#E2E8F0"), strokeWidth=0.8, rx=6, ry=6))

    # Core Entity: ADMISSION (Center-Top)
    d.add(Rect(185, 175, 146, 55, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_NAVY, strokeWidth=1.5))
    d.add(String(258, 215, "ADMISSION (Student)", fontName="Helvetica-Bold", fontSize=8.5, fillColor=C_NAVY, textAnchor="middle"))
    d.add(Line(185, 210, 331, 210, strokeColor=C_NAVY, strokeWidth=0.8))
    d.add(String(192, 198, "* _id (PK) | aadhaarNumber", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(192, 187, "* studentName, parentEmail, phone", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(192, 177, "* status, uucmsNo, rollNo", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))

    # Entity: USER (Top-Left)
    d.add(Rect(15, 175, 125, 55, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BLUE, strokeWidth=1.2))
    d.add(String(77, 215, "USER (Auth)", fontName="Helvetica-Bold", fontSize=8, fillColor=C_NAVY, textAnchor="middle"))
    d.add(Line(15, 210, 140, 210, strokeColor=C_BLUE, strokeWidth=0.8))
    d.add(String(20, 198, "* _id (PK) | role [Parent|Teacher]", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(20, 187, "* teacherId (Unique, Sparse)", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(20, 177, "* studentAadhaar, password", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))

    # Entity: ATTENDANCE (Bottom-Left)
    d.add(Rect(15, 30, 115, 55, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BLUE, strokeWidth=1.2))
    d.add(String(72, 70, "ATTENDANCE", fontName="Helvetica-Bold", fontSize=8, fillColor=C_NAVY, textAnchor="middle"))
    d.add(Line(15, 65, 130, 65, strokeColor=C_BLUE, strokeWidth=0.8))
    d.add(String(20, 53, "* _id (PK) | studentId (FK)", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(20, 42, "* subject, totalClasses", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(20, 32, "* classesPresent, percentage", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))

    # Entity: MARKS (Bottom-Center-Left)
    d.add(Rect(145, 30, 115, 55, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BLUE, strokeWidth=1.2))
    d.add(String(202, 70, "MARKS", fontName="Helvetica-Bold", fontSize=8, fillColor=C_NAVY, textAnchor="middle"))
    d.add(Line(145, 65, 260, 65, strokeColor=C_BLUE, strokeWidth=0.8))
    d.add(String(150, 53, "* _id (PK) | studentId (FK)", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(150, 42, "* examType (IA1..3, SemEnd)", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(150, 32, "* marksObtained, maxMarks", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))

    # Entity: BEHAVIOR & COMPLAINT (Bottom-Center-Right)
    d.add(Rect(275, 30, 115, 55, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BLUE, strokeWidth=1.2))
    d.add(String(332, 70, "BEHAVIOR & COMPLAINT", fontName="Helvetica-Bold", fontSize=7.5, fillColor=C_NAVY, textAnchor="middle"))
    d.add(Line(275, 65, 390, 65, strokeColor=C_BLUE, strokeWidth=0.8))
    d.add(String(280, 53, "* _id (PK) | studentId (FK)", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(280, 42, "* rating / severity [High,Med]", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(280, 32, "* category, remarks, action", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))

    # Entity: NOTICE (Bottom-Right)
    d.add(Rect(400, 30, 105, 55, rx=4, ry=4, fillColor=C_LIGHT_BLUE, strokeColor=C_BLUE, strokeWidth=1.2))
    d.add(String(452, 70, "NOTICE", fontName="Helvetica-Bold", fontSize=8, fillColor=C_NAVY, textAnchor="middle"))
    d.add(Line(400, 65, 505, 65, strokeColor=C_BLUE, strokeWidth=0.8))
    d.add(String(405, 53, "* _id (PK) | category", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(405, 42, "* title, eventDate, venue", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))
    d.add(String(405, 32, "* targetStream, targetStudentId", fontName="Helvetica", fontSize=6.5, fillColor=C_TEXT))

    # Relationships (Diamond connectors)
    # User to Admission (1 to 1..N)
    d.add(Polygon([140, 202, 162, 215, 185, 202, 162, 190], fillColor=C_REL_FILL, strokeColor=C_REL_BORDER, strokeWidth=1))
    d.add(String(162, 200, "1:1", fontName="Helvetica-Bold", fontSize=6, fillColor=C_REL_BORDER, textAnchor="middle"))
    d.add(Line(140, 202, 185, 202, strokeColor=C_BORDER_BLUE))

    # Admission to Attendance (1 to N)
    d.add(Line(205, 175, 72, 85, strokeColor=C_BORDER_BLUE, strokeWidth=1.2))
    d.add(String(135, 130, "1 : N (Tracks)", fontName="Helvetica-Bold", fontSize=6.5, fillColor=C_NAVY, textAnchor="middle"))

    # Admission to Marks (1 to N)
    d.add(Line(235, 175, 202, 85, strokeColor=C_BORDER_BLUE, strokeWidth=1.2))
    d.add(String(225, 130, "1 : N (Records)", fontName="Helvetica-Bold", fontSize=6.5, fillColor=C_NAVY, textAnchor="middle"))

    # Admission to Behavior (1 to N)
    d.add(Line(280, 175, 332, 85, strokeColor=C_BORDER_BLUE, strokeWidth=1.2))
    d.add(String(312, 130, "1 : N (Evaluates)", fontName="Helvetica-Bold", fontSize=6.5, fillColor=C_NAVY, textAnchor="middle"))

    # Admission to Notice (1 to 0..N)
    d.add(Line(310, 175, 452, 85, strokeColor=C_BORDER_BLUE, strokeWidth=1.2))
    d.add(String(395, 130, "1 : N (Broadcasts)", fontName="Helvetica-Bold", fontSize=6.5, fillColor=C_NAVY, textAnchor="middle"))

    return d
