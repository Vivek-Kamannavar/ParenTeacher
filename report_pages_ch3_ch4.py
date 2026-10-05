# report_pages_ch3_ch4.py
# Pages 15 to 30 of the ParenTeacher Project Report
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from report_styles import (
    PRIMARY, PRIMARY_LIGHT, SECONDARY, ACCENT, TEXT_DARK, TEXT_MUTED, BORDER_COLOR, BG_LIGHT,
    create_callout
)
from report_diagrams import create_dfd0_drawing, create_dfd1_drawing, create_er_drawing

def build_page_15(styles):
    """Page 15: Chapter 3 SRS - Introduction & Hardware Requirements"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (SRS)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.1 IEEE Standards Compliance and Overview", styles['SectionTitle']))
    p_srs = (
        "This System Requirement Specification (SRS) document defines the complete functional, non-functional, behavioral, and interface "
        "requirements for the <b>ParenTeacher</b> platform in strict adherence to the <b>IEEE 830-1998 Recommended Practice for Software "
        "Requirements Specifications</b>. This specification serves as a binding technical contract between institutional stakeholders, systems "
        "analysts, software developers, and quality assurance engineers throughout the software lifecycle."
    )
    story.append(Paragraph(p_srs, styles['Body']))
    
    story.append(Paragraph("3.2 Hardware Requirements Specification", styles['SectionTitle']))
    story.append(Paragraph("ParenTeacher is designed with an asynchronous, resource-efficient architecture that ensures seamless performance across commodity client workstations and scalable cloud or on-premises servers. Table 3.1 details the hardware specifications.", styles['Body']))
    story.append(Spacer(1, 3))
    
    hw_data = [
        [Paragraph("<b>Hardware Dimension</b>", styles['TableHeader']), Paragraph("<b>Minimum Required Specification</b>", styles['TableHeader']), Paragraph("<b>Recommended Production Specification</b>", styles['TableHeader'])],
        [
            Paragraph("<b>Server Processor (CPU)</b>", styles['TableCellBold']),
            Paragraph("Dual-Core Intel/AMD x86_64, 2.0 GHz or ARM64 Equivalent", styles['TableCell']),
            Paragraph("Quad-Core Intel Xeon / AMD EPYC / Apple Silicon, 3.2 GHz+", styles['TableCell'])
        ],
        [
            Paragraph("<b>Server System Memory (RAM)</b>", styles['TableCellBold']),
            Paragraph("4 GB DDR4 RAM (for Node.js runtime and local DB)", styles['TableCell']),
            Paragraph("16 GB DDR4/DDR5 ECC RAM for production clustering", styles['TableCell'])
        ],
        [
            Paragraph("<b>Server Persistent Storage</b>", styles['TableCellBold']),
            Paragraph("20 GB Standard SSD (for OS, Codebase, and Uploads)", styles['TableCell']),
            Paragraph("100 GB NVMe M.2 SSD with automated RAID-1 mirroring", styles['TableCell'])
        ],
        [
            Paragraph("<b>Network & Bandwidth</b>", styles['TableCellBold']),
            Paragraph("10 Mbps dedicated uplink / downlink bandwidth", styles['TableCell']),
            Paragraph("100 Mbps to 1 Gbps redundant low-latency fiber connection", styles['TableCell'])
        ],
        [
            Paragraph("<b>Faculty / Admin Client Workstations</b>", styles['TableCellBold']),
            Paragraph("Intel Core i3 / AMD Ryzen 3, 4 GB RAM, 1366x768 Display", styles['TableCell']),
            Paragraph("Intel Core i5 / Ryzen 5, 8 GB RAM, Full HD 1920x1080 Monitor", styles['TableCell'])
        ],
        [
            Paragraph("<b>Parent Mobile / Tablet Devices</b>", styles['TableCellBold']),
            Paragraph("Any smartphone supporting modern HTML5 web browser (WebKit/Blink)", styles['TableCell']),
            Paragraph("Android 10+ or iOS 14+ with 4G/5G/Wi-Fi internet access", styles['TableCell'])
        ]
    ]
    hw_table = Table(hw_data, colWidths=[130, 193, 193])
    hw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(hw_table)
    story.append(Paragraph("<b>Table 3.1:</b> Minimum and Recommended Hardware Specifications for Server and Client Tiers", styles['FigureCaption']))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("3.3 Network and Hosting Infrastructure Topology", styles['SectionTitle']))
    net_p = (
        "The system operates over standard TCP/IP networking protocols. In production deployments, client requests are routed through a reverse proxy "
        "(such as NGINX) that terminates TLS/SSL certificates, executes rate limiting, and forwards traffic to the internal Node.js port (default 5000). "
        "Static asset storage for uploaded documents (Aadhaar cards, caste certificates, marks cards) utilizes secure directory permissions with UUID renaming."
    )
    story.append(Paragraph(net_p, styles['Body']))
    story.append(PageBreak())
    return story

def build_page_16(styles):
    """Page 16: Chapter 3 SRS - Software Requirements & Technology Stack Justification"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.4 Software Environment and Dependencies", styles['SectionTitle']))
    p_sw = (
        "The software architecture of ParenTeacher leverages modern open-source runtimes, libraries, and frameworks that have attained wide "
        "industry adoption. Table 3.2 outlines the software environment specifications across the development, testing, and production tiers."
    )
    story.append(Paragraph(p_sw, styles['Body']))
    story.append(Spacer(1, 2))
    
    sw_data = [
        [Paragraph("<b>Component Layer</b>", styles['TableHeader']), Paragraph("<b>Software Platform / Library</b>", styles['TableHeader']), Paragraph("<b>Version / Specification</b>", styles['TableHeader']), Paragraph("<b>Technical Function</b>", styles['TableHeader'])],
        [
            Paragraph("<b>Operating System</b>", styles['TableCellBold']),
            Paragraph("Linux (Ubuntu LTS) / Windows", styles['TableCell']),
            Paragraph("Ubuntu 22.04 LTS / Win 11", styles['TableCell']),
            Paragraph("Host runtime environment for server and database", styles['TableCell'])
        ],
        [
            Paragraph("<b>Backend Runtime</b>", styles['TableCellBold']),
            Paragraph("Node.js (Active LTS)", styles['TableCell']),
            Paragraph("v20.x or v22.x LTS", styles['TableCell']),
            Paragraph("Non-blocking, asynchronous JavaScript engine", styles['TableCell'])
        ],
        [
            Paragraph("<b>Web API Framework</b>", styles['TableCellBold']),
            Paragraph("Express.js", styles['TableCell']),
            Paragraph("v4.19+", styles['TableCell']),
            Paragraph("RESTful routing, CORS, and middleware pipeline", styles['TableCell'])
        ],
        [
            Paragraph("<b>Database Engine</b>", styles['TableCellBold']),
            Paragraph("MongoDB Community / Atlas", styles['TableCell']),
            Paragraph("v6.0 or v7.0+", styles['TableCell']),
            Paragraph("High-performance JSON document persistence", styles['TableCell'])
        ],
        [
            Paragraph("<b>Data Modeling ODM</b>", styles['TableCellBold']),
            Paragraph("Mongoose", styles['TableCell']),
            Paragraph("v8.x", styles['TableCell']),
            Paragraph("Schema validation, relations, and type safety", styles['TableCell'])
        ],
        [
            Paragraph("<b>Frontend Framework</b>", styles['TableCellBold']),
            Paragraph("React.js (SPA)", styles['TableCell']),
            Paragraph("v18.3+", styles['TableCell']),
            Paragraph("Component-based reactive UI rendering", styles['TableCell'])
        ],
        [
            Paragraph("<b>Build & Bundler Tool</b>", styles['TableCellBold']),
            Paragraph("Vite", styles['TableCell']),
            Paragraph("v5.x / v6.x", styles['TableCell']),
            Paragraph("Hot Module Replacement (HMR) and optimized build", styles['TableCell'])
        ],
        [
            Paragraph("<b>Notification Engine</b>", styles['TableCellBold']),
            Paragraph("Nodemailer + SMTP", styles['TableCell']),
            Paragraph("v6.9+", styles['TableCell']),
            Paragraph("Asynchronous transactional email generation", styles['TableCell'])
        ],
        [
            Paragraph("<b>File Upload Engine</b>", styles['TableCellBold']),
            Paragraph("Multer", styles['TableCell']),
            Paragraph("v1.4+", styles['TableCell']),
            Paragraph("Multipart form-data parsing and disk storage", styles['TableCell'])
        ]
    ]
    sw_table = Table(sw_data, colWidths=[95, 125, 95, 201])
    sw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(sw_table)
    story.append(Paragraph("<b>Table 3.2:</b> Complete Software Technology Stack and Production Runtime Dependencies", styles['FigureCaption']))
    story.append(Spacer(1, 3))
    
    story.append(Paragraph("3.5 Justification of Full-Stack MERN Architecture", styles['SectionTitle']))
    just_p = (
        "The selection of the <b>MERN Stack</b> is rooted in its paradigm cohesion: using JavaScript/TypeScript across both frontend and backend tiers "
        "eliminates data serialization mismatches, enables seamless code sharing of validation schemas, and delivers high development velocity. "
        "Furthermore, MongoDB's JSON-native BSON storage aligns with the hierarchical nature of collegiate academic records (e.g., student documents "
        "and multi-semester marks cards embedded as sub-documents)."
    )
    story.append(Paragraph(just_p, styles['Body']))
    story.append(PageBreak())
    return story

def build_page_17(styles):
    """Page 17: Chapter 3 SRS - Functional Requirements: Student Admission Pipeline"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.6 Functional Requirements: Module 1 - Student Admission Pipeline", styles['SectionTitle']))
    story.append(Paragraph("The digital admission subsystem manages candidate registration, demographic ingestion, multi-board merit calculation, document verification, and administrative enrollment decisions.", styles['Body']))
    story.append(Spacer(1, 3))
    
    frs_adm = [
        "<b>FR-1.1: Multi-Step Registration Interface:</b> The system shall render a multi-step progressive admission form dividing data capture into: (i) Personal & Demographic Data, (ii) Academic Scores & Previous Institution Records, and (iii) Required Document Uploads.",
        "<b>FR-1.2: Aadhaar Identity Deduplication:</b> The system shall validate student Aadhaar numbers against a strict 12-digit numeric regular expression (/^\\d{12}$/). The database shall enforce a unique index constraint on `aadhaarNumber` to reject duplicate applications.",
        "<b>FR-1.3: Multi-Board Merit Calculation Engine:</b> The system shall dynamically adjust validation rules based on board selection: (a) If Karnataka State PUC, max marks shall be 600; (b) If Karnataka State SSLC, max marks shall be 625; (c) If CBSE Board, marks shall accept CGPA on a 0.0 to 10.0 scale and compute percentage automatically; (d) Cumulative percentage shall be strictly validated within 0.00% to 100.00%.",
        "<b>FR-1.4: Mandatory Document Repository:</b> The system shall ingest and store mandatory digital documents: Student Aadhaar Card, Father Aadhaar, Mother Aadhaar, Income/Caste Certificate, PUC II Marks Card, SSLC Marks Card, and Student Signature via multipart form-data.",
        "<b>FR-1.5: Administrative Decision Workflow:</b> The college administrator shall have the authority to inspect submitted records and mark the application status as 'Approved' or 'Rejected'. If rejected, a mandatory `rejectionReason` string must be recorded.",
        "<b>FR-1.6: UUCMS and Roll Number Assignment:</b> Upon admission approval, the administrator shall assign a formal Karnataka State UUCMS Registration Number and a departmental Class Roll Number, persisting both to the student's primary record.",
        "<b>FR-1.7: Real-Time Status Inquiry:</b> The system shall provide an unauthenticated public portal where applicants can query real-time admission status by entering their 12-digit Aadhaar number."
    ]
    for fr in frs_adm:
        story.append(Paragraph(fr, styles['Bullet']))
        
    story.append(Spacer(1, 5))
    story.append(create_callout("<b>Validation Rule Example:</b> If an applicant selects Karnataka State Board for SSLC, the system restricts maximum marks to 625. If entered marks exceed 625 or are negative, client and server validation instantly reject the transaction with an HTTP 400 Bad Request.", styles))
    story.append(PageBreak())
    return story

def build_page_18(styles):
    """Page 18: Chapter 3 SRS - Functional Requirements: Attendance & Eligibility Engine"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.7 Functional Requirements: Module 2 - Attendance & Eligibility Engine", styles['SectionTitle']))
    story.append(Paragraph("The attendance subsystem manages subject-wise class tracking, dynamic percentage calculation, statutory eligibility evaluation, and automated shortage alerting.", styles['Body']))
    story.append(Spacer(1, 3))
    
    frs_att = [
        "<b>FR-2.1: Dual Attendance Entry Modes:</b> The system shall empower authorized faculty members to record attendance via two interfaces: (i) Single Student Mode (for ad-hoc updates) and (ii) Bulk Class Roster Mode (tabular interface for all enrolled students in a subject cohort).",
        "<b>FR-2.2: Subject-Wise Segregation:</b> The system shall maintain distinct attendance records partitioned by subject name (e.g., Computer Networks, Database Management Systems, Operating Systems, Software Engineering).",
        "<b>FR-2.3: Automated Dynamic Percentage Calculator:</b> On every entry, the system shall compute the cumulative attendance percentage using the formula:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Percentage = round((Classes Present / Total Classes Conducted) * 100)</b><br/>"
        "The system shall reject inputs where `Classes Present` exceeds `Total Classes Conducted`.",
        "<b>FR-2.4: 75% Statutory Threshold Rule:</b> The system shall evaluate the computed percentage against university statutory regulations:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&bull; If Percentage &ge; 75%: Status is set to <b>'Eligible'</b>.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&bull; If Percentage &lt; 75%: Status is automatically flagged as <b>'Shortage'</b>.",
        "<b>FR-2.5: Immediate Shortage Alert Dispatch:</b> Whenever an attendance record is updated and the status results in 'Shortage', the system shall automatically trigger an event to dispatch an immediate warning notification (Email/SMS) to the student's registered parent email address.",
        "<b>FR-2.6: Historical Class Audit Trail:</b> The system shall timestamp every attendance transaction, recording the faculty member, date, total classes, and classes attended to preserve an audit trail for university inspection."
    ]
    for fr in frs_att:
        story.append(Paragraph(fr, styles['Bullet']))
        
    story.append(Spacer(1, 6))
    
    # Mathematical Rule Card
    rule_data = [
        [
            Paragraph("<b>STATUTORY ELIGIBILITY ENGINE MATHEMATICAL SPECIFICATION</b>", styles['TableHeader'])
        ],
        [
            Paragraph(
                "Let <i>C<sub>p</sub></i> be classes present, <i>C<sub>t</sub></i> be total classes conducted.<br/>"
                "<b>Attendance Percentage (A%)</b> = <i>floor((C<sub>p</sub> / C<sub>t</sub>) &times; 100)</i><br/>"
                "<b>Eligibility State E</b> = <i>'Eligible'</i> if A% &ge; 75, else <i>'Shortage'</i><br/>"
                "<b>Trigger Condition:</b> If (E == 'Shortage' and Prior_E != 'Shortage') &rarr; <i>DispatchParentAlert()</i>",
                styles['TableCellBold']
            )
        ]
    ]
    rule_table = Table(rule_data, colWidths=[516])
    rule_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BACKGROUND', (0,1), (-1,-1), HexColor('#F0FDF4')),
        ('BOX', (0,0), (-1,-1), 1, HexColor('#86EFAC')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(rule_table)
    story.append(PageBreak())
    return story

def build_page_19(styles):
    """Page 19: Chapter 3 SRS - Functional Requirements: Continuous Assessment & Internal Marks"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.8 Functional Requirements: Module 3 - Continuous Assessment & Marks", styles['SectionTitle']))
    story.append(Paragraph("The continuous assessment subsystem manages internal test examinations, semester finals, passing criteria determination, and score dissemination to guardians.", styles['Body']))
    story.append(Spacer(1, 3))
    
    frs_marks = [
        "<b>FR-3.1: Examination Tier Categorization:</b> The system shall support examination types adhering to university grading regulations: (i) Internal Assessment 1 (IA-1), (ii) Internal Assessment 2 (IA-2), (iii) Internal Assessment 3 (IA-3), and (iv) Semester End Examinations.",
        "<b>FR-3.2: Multi-Semester and Subject Mapping:</b> Each marks entry shall be associated with a specific Academic Semester (1st to 8th Semester) and Subject Title, referencing the student's unique `studentId` foreign key.",
        "<b>FR-3.3: Score Validation and Percentage Calculation:</b> The system shall accept `marksObtained` and `maxMarks`. The system shall validate that $0 \\le \\text{marksObtained} \\le \\text{maxMarks}$. The system shall automatically compute `percentage = round((marksObtained / maxMarks) * 100)`.",
        "<b>FR-3.4: Automated Pass/Fail Status Determination:</b> The system shall evaluate obtained marks against institutional passing thresholds (default 40% aggregate): if percentage &ge; 40%, the record status is set to 'Pass'; otherwise, it is flagged as 'Fail'.",
        "<b>FR-3.5: Qualitative Faculty Remarks:</b> Faculty members shall be provided a text input field to append qualitative remarks explaining student performance, identifying specific strengths, or noting concepts requiring remediation.",
        "<b>FR-3.6: Instant Scorecard Dissemination:</b> Upon marks entry submission, the system shall generate a transactional notification dispatch to the parent's registered email detailing the subject, exam type, score, percentage, and teacher feedback."
    ]
    for fr in frs_marks:
        story.append(Paragraph(fr, styles['Bullet']))
        
    story.append(Spacer(1, 6))
    
    marks_summary = [
        [Paragraph("<b>Exam Category</b>", styles['TableHeader']), Paragraph("<b>Standard Weightage</b>", styles['TableHeader']), Paragraph("<b>Threshold Criteria</b>", styles['TableHeader']), Paragraph("<b>Guardian Alert Mode</b>", styles['TableHeader'])],
        [
            Paragraph("<b>IA-1 (Internal Assessment 1)</b>", styles['TableCellBold']),
            Paragraph("Typically 25 or 50 Marks", styles['TableCell']),
            Paragraph("Pass if Marks &ge; 40%", styles['TableCell']),
            Paragraph("Transactional Email with Scorecard", styles['TableCell'])
        ],
        [
            Paragraph("<b>IA-2 (Internal Assessment 2)</b>", styles['TableCellBold']),
            Paragraph("Typically 25 or 50 Marks", styles['TableCell']),
            Paragraph("Pass if Marks &ge; 40%", styles['TableCell']),
            Paragraph("Transactional Email with Scorecard", styles['TableCell'])
        ],
        [
            Paragraph("<b>IA-3 (Internal Assessment 3)</b>", styles['TableCellBold']),
            Paragraph("Typically 25 or 50 Marks", styles['TableCell']),
            Paragraph("Pass if Marks &ge; 40%", styles['TableCell']),
            Paragraph("Transactional Email with Scorecard", styles['TableCell'])
        ],
        [
            Paragraph("<b>Semester End Final Exam</b>", styles['TableCellBold']),
            Paragraph("100 Marks (University Scale)", styles['TableCell']),
            Paragraph("Pass if Marks &ge; 40%", styles['TableCell']),
            Paragraph("Consolidated Grade Card & Status", styles['TableCell'])
        ]
    ]
    marks_table = Table(marks_summary, colWidths=[130, 110, 130, 146])
    marks_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(marks_table)
    story.append(Paragraph("<b>Table 3.3:</b> Assessment Tiers, Threshold Criteria, and Guardian Notification Pipeline", styles['FigureCaption']))
    story.append(PageBreak())
    return story

def build_page_20(styles):
    """Page 20: Chapter 3 SRS - Functional Requirements: Behavioral & Incident Management"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.9 Functional Requirements: Module 4 - Behavioral & Incident Tracking", styles['SectionTitle']))
    story.append(Paragraph("This module provides structured mechanisms for continuous non-cognitive evaluation, classroom conduct grading, and formal disciplinary incident escalation.", styles['Body']))
    story.append(Spacer(1, 3))
    
    frs_beh = [
        "<b>FR-4.1: Five-Point Behavioral Rating Metric:</b> The system shall enable faculty members to assign a qualitative rating to enrolled students selected from a validated 5-point enumeration: `['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Disruptive']`.",
        "<b>FR-4.2: Behavioral Domain Categorization:</b> Each behavioral observation shall be classified under a functional domain, defaulting to 'Classroom Conduct', but supporting 'Academic Integrity', 'Laboratory Etiquette', and 'Campus Discipline'.",
        "<b>FR-4.3: Mandatory Descriptive Remarks:</b> The system shall require faculty members to enter explicit, substantive text feedback (`remarks`) detailing the context of the evaluation before saving a behavioral record.",
        "<b>FR-4.4: Formal Incident & Complaint Logging:</b> In instances of significant misconduct, faculty members shall log a formal complaint record comprising: (i) Complaint Title, (ii) Severity Tier, (iii) Detailed Incident Description, and (iv) Action Taken.",
        "<b>FR-4.5: Severity Tier Classification:</b> The complaint severity shall be restricted to an enumeration: `['Low', 'Medium', 'High']`. High severity incidents shall mandate immediate administrative escalation.",
        "<b>FR-4.6: Action Taken Tracking:</b> The system shall default the `actionTaken` field to 'Parent Notification Sent' and enable administrators to update the status to 'Counseling Conducted', 'Disciplinary Committee Review', or 'Resolved'.",
        "<b>FR-4.7: Automated Guardian Disciplinary Notice:</b> When any High-Severity complaint is logged, the system shall immediately dispatch an urgent priority notification to the registered parent email address."
    ]
    for fr in frs_beh:
        story.append(Paragraph(fr, styles['Bullet']))
        
    story.append(Spacer(1, 6))
    
    # Severity matrix card
    sev_data = [
        [Paragraph("<b>Severity Tier</b>", styles['TableHeader']), Paragraph("<b>Example Incident Domain</b>", styles['TableHeader']), Paragraph("<b>Standard Action Taken</b>", styles['TableHeader']), Paragraph("<b>Guardian Escalation SLA</b>", styles['TableHeader'])],
        [
            Paragraph("<b>Low Severity</b>", styles['TableCellBold']),
            Paragraph("Minor classroom distraction, late arrival to lecture", styles['TableCell']),
            Paragraph("Verbal counseling, noted in portal log", styles['TableCell']),
            Paragraph("Reflected in periodic portal report", styles['TableCell'])
        ],
        [
            Paragraph("<b>Medium Severity</b>", styles['TableCellBold']),
            Paragraph("Repeated unexcused absence, incomplete laboratory assignments", styles['TableCell']),
            Paragraph("Formal faculty reprimand, parent email alert", styles['TableCell']),
            Paragraph("Automated email within 1 hour", styles['TableCell'])
        ],
        [
            Paragraph("<b>High Severity</b>", styles['TableCellBold']),
            Paragraph("Examination malpractice, damage to college property, insubordination", styles['TableCell']),
            Paragraph("Disciplinary Committee summons, parent conference", styles['TableCell']),
            Paragraph("Immediate transactional Email & SMS", styles['TableCell'])
        ]
    ]
    sev_table = Table(sev_data, colWidths=[90, 160, 140, 126])
    sev_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(sev_table)
    story.append(Paragraph("<b>Table 3.4:</b> Behavioral Incident Severity Tiers, Escalation Actions, and Service Level Agreements (SLAs)", styles['FigureCaption']))
    story.append(PageBreak())
    return story

def build_page_21(styles):
    """Page 21: Chapter 3 SRS - Functional Requirements: Notices & Parent Dashboard"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.10 Functional Requirements: Module 5 - Campus Event Broadcasting", styles['SectionTitle']))
    frs_notice = [
        "<b>FR-5.1: Categorized Event Posting:</b> The system shall enable faculty and administrators to publish institutional notices categorized into: `['Hackathon', 'Gaming', 'Sports', 'Cultural', 'Academic', 'General']`.",
        "<b>FR-5.2: Event Attributes & Venue Details:</b> Each notice shall store a mandatory Title, Event Date, Venue Location, Detailed Description, and Creation Timestamp.",
        "<b>FR-5.3: Granular Audience Targeting:</b> The system shall support broad or targeted broadcasting via the `targetStream` field (e.g., 'All', 'Science', 'Commerce', 'Arts') and an optional `targetStudentId` for student-specific commendations."
    ]
    for fr in frs_notice:
        story.append(Paragraph(fr, styles['Bullet']))
        
    story.append(Spacer(1, 4))
    story.append(Paragraph("3.11 Functional Requirements: Module 6 - Parent Dashboard & Notifications", styles['SectionTitle']))
    frs_parent = [
        "<b>FR-6.1: Unified Multi-Ward Performance View:</b> The parent portal shall authenticate the legal guardian and present an integrated dashboard displaying their ward's: (i) Real-time subject-wise attendance percentages with color badges, (ii) CIE examination scores and passing status, (iii) Behavioral conduct ratings and teacher remarks, and (iv) Active college notices.",
        "<b>FR-6.2: Color-Coded Statutory Attendance Indicators:</b> The portal shall render an immediate visual health indicator: Green badge for attendance &ge; 75% ('Eligible') and Red pulsating badge for attendance &lt; 75% ('Shortage Warning').",
        "<b>FR-6.3: Asynchronous Transactional Email Pipeline:</b> The backend shall interface with an SMTP mail server via Nodemailer to dispatch styled HTML email templates automatically upon: (a) Admission application approval or rejection, (b) Attendance shortage detection, (c) Marks publication, and (d) Disciplinary complaint lodging.",
        "<b>FR-6.4: Audit Logging for Communications:</b> The system shall persist every dispatched email into an `EmailLog` collection and every SMS into an `SmsLog` collection, recording recipient, subject, payload, delivery timestamp, and dispatch status."
    ]
    for fr in frs_parent:
        story.append(Paragraph(fr, styles['Bullet']))
        
    story.append(Spacer(1, 6))
    story.append(create_callout("<b>Parent Usability Guarantee:</b> The parent dashboard requires no software installation, functioning responsively across low-bandwidth 3G/4G mobile devices with page load times under 1.5 seconds.", styles))
    story.append(PageBreak())
    return story

def build_page_22(styles):
    """Page 22: Chapter 3 SRS - Non-Functional Requirements"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.12 Non-Functional Requirements (NFR) Specification", styles['SectionTitle']))
    p_nfr = (
        "Non-functional requirements specify the operational quality criteria, security constraints, performance thresholds, and architectural "
        "standards necessary to ensure the robust, secure, and uninterrupted operation of ParenTeacher."
    )
    story.append(Paragraph(p_nfr, styles['Body']))
    story.append(Spacer(1, 3))
    
    nfrs = [
        "<b>NFR-1: Cryptographic Security & Password Protection:</b> All user passwords stored in the `users` collection shall be hashed using the <b>bcrypt</b> algorithm with a minimum salt factor of 10 rounds. Passwords shall never be stored, logged, or transmitted in plaintext.",
        "<b>NFR-2: Role-Based Route Authorization Guards:</b> The backend Express server shall intercept all incoming API requests through authorization middleware, validating user roles ('Parent' vs. 'Teacher' vs. 'Admin') and terminating unauthorized attempts with an HTTP 403 Forbidden status.",
        "<b>NFR-3: Performance and Latency Benchmarks:</b> The system shall maintain an average API response time of under 300 milliseconds for standard queries under a concurrent load of at least 500 simultaneous users.",
        "<b>NFR-4: Database Resilience & Graceful Offline Fallback:</b> In the event of a transient MongoDB connection drop, the server shall not crash. Instead, it shall engage a connection-check middleware returning HTTP 503 Service Unavailable, while allowing the client SPA to load and display helpful offline feedback.",
        "<b>NFR-5: High Availability (99.9% Uptime):</b> The system architecture shall support stateless Node.js server instances, enabling process managers (such as PM2 or Docker swarm) to automatically restart instances upon memory leaks or uncaught exceptions.",
        "<b>NFR-6: Data Integrity and Referential Constraints:</b> Mongoose schemas shall enforce strict type safety, required field validations, regular expression bounds, and pre-save hooks to prevent data corruption.",
        "<b>NFR-7: Cross-Browser & Mobile Portability:</b> The frontend React application shall render identically and responsively across Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Android/iOS WebKit mobile viewports."
    ]
    for nfr in nfrs:
        story.append(Paragraph(nfr, styles['Bullet']))
        
    story.append(Spacer(1, 6))
    
    # NFR SLA Summary Table
    sla_data = [
        [Paragraph("<b>Quality Attribute</b>", styles['TableHeader']), Paragraph("<b>Target Metric / SLA</b>", styles['TableHeader']), Paragraph("<b>Enforcement Mechanism</b>", styles['TableHeader'])],
        [Paragraph("<b>API Latency</b>", styles['TableCellBold']), Paragraph("&lt; 300 ms (95th percentile)", styles['TableCell']), Paragraph("Indexed MongoDB queries, lean projections", styles['TableCell'])],
        [Paragraph("<b>System Availability</b>", styles['TableCellBold']), Paragraph("99.9% Annual Uptime", styles['TableCell']), Paragraph("PM2 cluster mode, automatic health checks", styles['TableCell'])],
        [Paragraph("<b>Data Security</b>", styles['TableCellBold']), Paragraph("Zero Plaintext Passwords", styles['TableCell']), Paragraph("bcrypt hashing (salt rounds = 10)", styles['TableCell'])],
        [Paragraph("<b>Notification SLA</b>", styles['TableCellBold']), Paragraph("&lt; 5 seconds delivery", styles['TableCell']), Paragraph("Asynchronous Nodemailer SMTP worker", styles['TableCell'])]
    ]
    sla_table = Table(sla_data, colWidths=[120, 160, 236])
    sla_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(sla_table)
    story.append(Paragraph("<b>Table 3.5:</b> Non-Functional Quality Attributes and Service Level Agreements", styles['FigureCaption']))
    story.append(PageBreak())
    return story

def build_page_23(styles):
    """Page 23: Chapter 3 SRS - Operational & Interface Requirements"""
    story = []
    story.append(Paragraph("CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATION (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("3.13 Operational & User Ergonomics Requirements", styles['SectionTitle']))
    p_op = (
        "Operational requirements specify the human interaction factors, ergonomics, accessibility standards, and runtime interfaces "
        "governing how users engage with the software across diverse administrative and domestic contexts."
    )
    story.append(Paragraph(p_op, styles['Body']))
    story.append(Spacer(1, 3))
    
    ops = [
        "<b>1. Accessibility & Visual Hierarchy (WCAG 2.1 AA):</b> The user interface conforms to Web Content Accessibility Guidelines (WCAG 2.1 Level AA) with a minimum text contrast ratio of 4.5:1 against light backgrounds, accessible keyboard tab-navigation, and descriptive ARIA labels on all form inputs and submission buttons.",
        "<b>2. Zero-Client Installation Footprint:</b> No proprietary desktop executables, mobile APK downloads, or browser extensions are required. Users access the complete system through any modern HTML5/ES6 compliant web browser.",
        "<b>3. Form Auto-Persistence & Draft Recovery:</b> To mitigate applicant frustration during lengthy multi-step admission filings on erratic cellular networks, client-side React state preserves partially entered data in memory, alerting users before accidental window closures.",
        "<b>4. Intuitive Error Remediation:</b> Every failed validation (e.g., mismatched passwords, invalid Aadhaar length, marks exceeding maximum limit) produces an immediate, user-friendly notification message pinpointing the exact field requiring correction."
    ]
    for o in ops:
        story.append(Paragraph(o, styles['Bullet']))
        
    story.append(Spacer(1, 4))
    story.append(Paragraph("3.14 External Interface Specifications", styles['SectionTitle']))
    
    exts = [
        "<b>1. Software Interfaces (REST / JSON):</b> The client and server tiers communicate exclusively through standard HTTP/HTTPS methods (GET, POST, PUT, DELETE) exchanging JSON payloads conforming to OpenAPI standards.",
        "<b>2. Database Interface (Mongoose ODM):</b> The Node.js application connects to MongoDB using the official MongoDB Wire Protocol over TCP port 27017, utilizing connection pooling with a maximum pool size of 20 concurrent sockets.",
        "<b>3. Mail Gateway Interface (SMTP):</b> The notification engine interfaces with SMTP mail servers (such as Gmail SMTP, SendGrid, or institutional mail exchanges) over TLS port 465 / 587 using SASL authentication.",
        "<b>4. Multipart Storage Interface (Multer):</b> Uploaded physical document files (Aadhaar cards, marksheets) are intercepted via multipart MIME headers and streamed to secure localized filesystem directories (`/uploads`) with sanitize-on-write policies."
    ]
    for e in exts:
        story.append(Paragraph(e, styles['Bullet']))
        
    story.append(Spacer(1, 6))
    story.append(create_callout("<b>Interface Governance:</b> Decoupling the presentation tier from the persistence engine via REST APIs ensures that future mobile applications (React Native / Flutter) can interface with the exact same backend endpoints without modification.", styles))
    story.append(PageBreak())
    return story

def build_page_24(styles):
    """Page 24: Chapter 4: System Design - Architecture & Paradigm"""
    story = []
    story.append(Paragraph("CHAPTER 4: SYSTEM DESIGN & ARCHITECTURE", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("4.1 Multi-Tier Architectural Paradigm", styles['SectionTitle']))
    p_arch = (
        "The architecture of ParenTeacher is organized according to the <b>Multi-Tier Model-View-Controller (MVC)</b> architectural pattern, "
        "adapted for modern decoupled Single Page Applications. The platform is partitioned into four distinct operational layers: "
        "(i) <b>Presentation Layer (React 18 SPA)</b>, (ii) <b>API Gateway & Middleware Layer (Express.js)</b>, (iii) <b>Service & Business "
        "Logic Layer (Node.js Controllers & Background Workers)</b>, and (iv) <b>Persistence Layer (MongoDB Database)</b>."
    )
    story.append(Paragraph(p_arch, styles['Body']))
    story.append(Spacer(1, 3))
    
    # Architecture Layer Table
    arch_tbl_data = [
        [Paragraph("<b>Architectural Layer</b>", styles['TableHeader']), Paragraph("<b>Core Components & Technologies</b>", styles['TableHeader']), Paragraph("<b>Primary System Responsibilities</b>", styles['TableHeader'])],
        [
            Paragraph("<b>Presentation Layer</b><br/>(Client-Side View)", styles['TableCellBold']),
            Paragraph("React 18, Vite 6, Modern CSS Design System, Responsive Glassmorphic Layouts", styles['TableCell']),
            Paragraph("Renders dynamic UI views; captures user input; manages local component state; dispatches asynchronous AJAX/Fetch HTTP requests.", styles['TableCell'])
        ],
        [
            Paragraph("<b>API & Middleware Layer</b><br/>(Controller Boundary)", styles['TableCellBold']),
            Paragraph("Express.js Router, CORS, Express JSON parser, Multer file interceptor", styles['TableCell']),
            Paragraph("Intercepts incoming HTTP requests; validates request headers; enforces CORS security; parses multipart form bodies.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Service & Logic Layer</b><br/>(Controller Core)", styles['TableCellBold']),
            Paragraph("Node.js Business Controllers, Nodemailer SMTP Worker, Eligibility Engine", styles['TableCell']),
            Paragraph("Executes business rules; performs Aadhaar deduplication; computes attendance percentages; evaluates 75% threshold; sends emails.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Data Storage Layer</b><br/>(Model / Persistence)", styles['TableCellBold']),
            Paragraph("MongoDB 7.0 Document Database, Mongoose ODM, BSON Storage Engine", styles['TableCell']),
            Paragraph("Maintains schema integrity; enforces unique and compound indices; persists student records, logs, and credentials reliably.", styles['TableCell'])
        ]
    ]
    arch_table = Table(arch_tbl_data, colWidths=[120, 160, 236])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(arch_table)
    story.append(Paragraph("<b>Table 4.1:</b> Multi-Tier System Architecture and Functional Layer Responsibilities", styles['FigureCaption']))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("4.2 Request-Response Lifecycle & Security Middleware Pipeline", styles['SectionTitle']))
    life_p = (
        "When a client browser initiates an interaction, the request passes through a strictly ordered middleware pipeline: "
        "(1) <b>CORS Filter:</b> Validates incoming origin headers; (2) <b>Body Parser:</b> Transforms incoming JSON payloads into JavaScript objects; "
        "(3) <b>Connection Guard:</b> Verifies that the MongoDB driver is in connected state (`readyState === 1`), intercepting connection drops before "
        "controller execution; (4) <b>Route Handler:</b> Maps the request to the corresponding controller; and (5) <b>Error Middleware:</b> Catches unhandled "
        "exceptions and converts them into standardized JSON error responses."
    )
    story.append(Paragraph(life_p, styles['Body']))
    story.append(PageBreak())
    return story

def build_page_25(styles):
    """Page 25: Chapter 4: System Design - Data Flow Diagram: Level 0 (Context Diagram)"""
    story = []
    story.append(Paragraph("CHAPTER 4: SYSTEM DESIGN (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("4.3 Data Flow Diagram (DFD) Conventions and Principles", styles['SectionTitle']))
    p_dfd = (
        "A Data Flow Diagram (DFD) is a foundational graphical modeling notation that visualizes the flow of information through an information system. "
        "In accordance with <b>Gane and Sarson</b> and <b>Yourdon/DeMarco</b> modeling conventions, the system represents external entities as rectangles, "
        "processes as circles or rounded rectangles, data flows as directional arrows with labels, and data stores as open-ended horizontal bars."
    )
    story.append(Paragraph(p_dfd, styles['Body']))
    story.append(Spacer(1, 2))
    
    story.append(Paragraph("4.4 DFD Level 0: System Context Diagram", styles['SectionTitle']))
    story.append(Paragraph("The Level 0 Context Diagram establishes the highest conceptual view of ParenTeacher, defining the external actors interacting with the central platform boundary and the primary input/output data streams.", styles['Body']))
    story.append(Spacer(1, 3))
    
    # Insert DFD Level 0 Drawing
    dfd0_drawing = create_dfd0_drawing(w=516, h=215)
    story.append(dfd0_drawing)
    story.append(Paragraph("<b>Figure 4.1:</b> DFD Level 0 - High-Level System Context Diagram for ParenTeacher", styles['FigureCaption']))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("4.5 Detailed Analysis of Entity Interactions in DFD Level 0", styles['SectionTitle']))
    story.append(Paragraph(
        "<b>1. Student / Applicant Entity:</b> Transmits admission applications, academic scores, and digital certificates into the system. Receives real-time application status confirmations, assigned UUCMS registration numbers, and public notice announcements.<br/>"
        "<b>2. Parent / Guardian Entity:</b> Authenticates via student Aadhaar / registered mobile and OTP. Receives real-time attendance percentage radar, continuous assessment scorecards, behavioral conduct evaluations, and immediate shortage warnings.<br/>"
        "<b>3. Faculty / Teacher Entity:</b> Logs subject attendance (single or bulk roster), enters internal assessment marks, files qualitative behavioral remarks, and submits disciplinary incident reports.<br/>"
        "<b>4. College Administrator Entity:</b> Reviews submitted admission applications, verifies uploaded document authenticity, records approval/rejection decisions, assigns institutional roll numbers, and broadcasts college-wide events.",
        styles['Body']
    ))
    story.append(PageBreak())
    return story

def build_page_26(styles):
    """Page 26: Chapter 4: System Design - Data Flow Diagram: Level 1 (Decomposition Diagram)"""
    story = []
    story.append(Paragraph("CHAPTER 4: SYSTEM DESIGN (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("4.6 DFD Level 1: Functional Process Decomposition", styles['SectionTitle']))
    p_dfd1 = (
        "The DFD Level 1 diagram decomposes the central system process (0.0) into six discrete functional processes, illustrating "
        "the transformation of data streams and their interactions with dedicated data repositories (D1 through D6)."
    )
    story.append(Paragraph(p_dfd1, styles['Body']))
    story.append(Spacer(1, 2))
    
    # Insert DFD Level 1 Drawing
    dfd1_drawing = create_dfd1_drawing(w=516, h=240)
    story.append(dfd1_drawing)
    story.append(Paragraph("<b>Figure 4.2:</b> DFD Level 1 - Detailed Functional Process Decomposition Diagram", styles['FigureCaption']))
    story.append(Spacer(1, 3))
    
    story.append(Paragraph("4.7 Functional Processes and Data Store Mapping", styles['SectionTitle']))
    story.append(Paragraph(
        "<b>Process 1.0 (Admission & Document Processing):</b> Ingests candidate details, executes merit calculation, writes validated records to <b>D1 (Admissions Store)</b>, and returns status tokens.<br/>"
        "<b>Process 2.0 (Identity & Role-Based Access Control):</b> Authenticates parents and teachers, generates session tokens, hashes passwords, and queries <b>D2 (Users & Credentials Store)</b>.<br/>"
        "<b>Process 3.0 (Attendance & Statutory Eligibility Engine):</b> Computes attendance percentage ($Present / Total \\times 100$), updates <b>D3 (Academic Records Store)</b>, and triggers Process 6.0 upon shortage detection.<br/>"
        "<b>Process 4.0 (Continuous Assessment & Marks Engine):</b> Evaluates exam scores (IA-1, IA-2, IA-3, Sem Finals), applies passing thresholds, persists records to D3, and dispatches scorecards.<br/>"
        "<b>Process 5.0 (Behavioral & Discipline Tracking):</b> Captures 5-scale conduct ratings, records complaint severities, persists incident logs, and alerts administration.<br/>"
        "<b>Process 6.0 (Broadcast & Transactional Notification Bus):</b> Listens for system events, renders dynamic email templates, and transmits dispatches to parents via external mail/SMS gateways.",
        styles['Body']
    ))
    story.append(PageBreak())
    return story

def build_page_27(styles):
    """Page 27: Chapter 4: System Design - Entity-Relationship (E-R) Diagram"""
    story = []
    story.append(Paragraph("CHAPTER 4: SYSTEM DESIGN (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("4.8 Conceptual Data Modeling & Semantic Constraints", styles['SectionTitle']))
    p_er = (
        "The conceptual data model defines the logical structures, entities, attributes, and cardinality relationships governing information "
        "storage within ParenTeacher. While MongoDB is a document-oriented database, enforcing rigorous referential integrity through foreign key "
        "references (`ObjectId` references in Mongoose) is critical for institutional data reliability."
    )
    story.append(Paragraph(p_er, styles['Body']))
    story.append(Spacer(1, 2))
    
    # Insert E-R Diagram Drawing
    er_drawing = create_er_drawing(w=516, h=240)
    story.append(er_drawing)
    story.append(Paragraph("<b>Figure 4.3:</b> Entity-Relationship (E-R) Diagram Illustrating Collections, Keys, and Cardinalities", styles['FigureCaption']))
    story.append(Spacer(1, 3))
    
    story.append(Paragraph("4.9 Entity Cardinality and Referential Rules", styles['SectionTitle']))
    story.append(Paragraph(
        "<b>1. Admission to Attendance (1 : N):</b> A single admitted student record relates to multiple subject attendance records. Each attendance entry maintains a foreign key reference (`studentId`) pointing to `Admission._id`.<br/>"
        "<b>2. Admission to Marks (1 : N):</b> A student accumulates multiple assessment records across IA-1, IA-2, IA-3, and semester examinations.<br/>"
        "<b>3. Admission to Behavior & Complaint (1 : N):</b> A student may possess multiple qualitative conduct evaluations and formal disciplinary incident logs.<br/>"
        "<b>4. User to Admission (1 : 1..N):</b> A parent user account maps to one or more admitted wards via unique `studentAadhaar` linking, enabling multi-child parental monitoring under a single parent account.<br/>"
        "<b>5. Notice to Admission (1 : 0..N):</b> College notices broadcast generally to all students (`targetStream = 'All'`) or associate optionally with an individual student for specific commendation.",
        styles['Body']
    ))
    story.append(PageBreak())
    return story

def build_page_28(styles):
    """Page 28: Chapter 4: System Design - Database Schema Design (Part 1)"""
    story = []
    story.append(Paragraph("CHAPTER 4: SYSTEM DESIGN (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("4.10 Physical Database Schema Specification (Part 1)", styles['SectionTitle']))
    p_sch = (
        "The database schema is implemented using Mongoose schemas on top of MongoDB collections. "
        "This section details the formal field definitions, BSON types, validation constraints, and default values for the core collections."
    )
    story.append(Paragraph(p_sch, styles['Body']))
    story.append(Spacer(1, 2))
    
    # Table 4.2: Admission Schema Table
    story.append(Paragraph("<b>Collection: `admissions` (Primary Student Record)</b>", styles['SubsectionTitle']))
    adm_schema_data = [
        [Paragraph("<b>Field Name</b>", styles['TableHeader']), Paragraph("<b>BSON Data Type</b>", styles['TableHeader']), Paragraph("<b>Constraints / Rules</b>", styles['TableHeader']), Paragraph("<b>Field Description & Semantics</b>", styles['TableHeader'])],
        [Paragraph("`_id`", styles['TableCellBold']), Paragraph("ObjectId", styles['TableCell']), Paragraph("Primary Key, Auto", styles['TableCell']), Paragraph("Unique internal document identifier", styles['TableCell'])],
        [Paragraph("`studentName`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, Trimmed", styles['TableCell']), Paragraph("Full legal name of the candidate", styles['TableCell'])],
        [Paragraph("`motherName`, `fatherName`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, Trimmed", styles['TableCell']), Paragraph("Legal parents / guardians' names", styles['TableCell'])],
        [Paragraph("`aadhaarNumber`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, Unique, 12-digit regex", styles['TableCell']), Paragraph("Student 12-digit national Aadhaar identity", styles['TableCell'])],
        [Paragraph("`parentPhone`, `parentEmail`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, 10-digit / Email regex", styles['TableCell']), Paragraph("Contact information for transactional alerts", styles['TableCell'])],
        [Paragraph("`dob`, `previousStream`", styles['TableCellBold']), Paragraph("Date / String", styles['TableCell']), Paragraph("Required, Enum: Science/Comm/Arts", styles['TableCell']), Paragraph("Date of birth and qualifying academic stream", styles['TableCell'])],
        [Paragraph("`pucBoard`, `sslcBoard`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Enum: ['State', 'CBSE']", styles['TableCell']), Paragraph("Qualifying secondary education examination board", styles['TableCell'])],
        [Paragraph("`pucMarks`, `pucPercentage`", styles['TableCellBold']), Paragraph("Number", styles['TableCell']), Paragraph("0-600 max marks, 0-100%", styles['TableCell']), Paragraph("12th / PUC academic merit metrics", styles['TableCell'])],
        [Paragraph("`sslcMarks`, `sslcPercentage`", styles['TableCellBold']), Paragraph("Number", styles['TableCell']), Paragraph("0-625 max marks, 0-100%", styles['TableCell']), Paragraph("10th / SSLC academic merit metrics", styles['TableCell'])],
        [Paragraph("`documents` (Sub-document)", styles['TableCellBold']), Paragraph("Object", styles['TableCell']), Paragraph("Aadhaar, MarksCards, Signature paths", styles['TableCell']), Paragraph("Secure storage paths for uploaded digital certificates", styles['TableCell'])],
        [Paragraph("`status`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Enum: ['Pending', 'Approved', 'Rejected']", styles['TableCell']), Paragraph("Administrative onboarding decision status", styles['TableCell'])],
        [Paragraph("`uucmsNo`, `rollNo`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Trimmed, Default: ''", styles['TableCell']), Paragraph("Assigned university and departmental identifiers", styles['TableCell'])],
        [Paragraph("`createdAt`", styles['TableCellBold']), Paragraph("Date", styles['TableCell']), Paragraph("Default: Date.now", styles['TableCell']), Paragraph("Application submission timestamp", styles['TableCell'])]
    ]
    adm_table = Table(adm_schema_data, colWidths=[110, 80, 140, 186])
    adm_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 1.8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(adm_table)
    story.append(Spacer(1, 4))
    
    # Table 4.3: User Schema Table
    story.append(Paragraph("<b>Collection: `users` (Authentication & Role Governance)</b>", styles['SubsectionTitle']))
    usr_schema_data = [
        [Paragraph("<b>Field Name</b>", styles['TableHeader']), Paragraph("<b>BSON Data Type</b>", styles['TableHeader']), Paragraph("<b>Constraints / Rules</b>", styles['TableHeader']), Paragraph("<b>Field Description & Semantics</b>", styles['TableHeader'])],
        [Paragraph("`role`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, Enum: ['Parent', 'Teacher']", styles['TableCell']), Paragraph("Role-based access level governing authorization", styles['TableCell'])],
        [Paragraph("`phone`, `parentEmail`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Sparse index, Lowercase", styles['TableCell']), Paragraph("Parent contact identifier for login and OTP dispatch", styles['TableCell'])],
        [Paragraph("`studentAadhaar`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Sparse index, 12-digit regex", styles['TableCell']), Paragraph("Foreign link mapping parent account to ward record", styles['TableCell'])],
        [Paragraph("`teacherId`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Unique, Sparse index", styles['TableCell']), Paragraph("Unique institutional identifier for faculty members", styles['TableCell'])],
        [Paragraph("`password`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, bcrypt hash string", styles['TableCell']), Paragraph("Cryptographically hashed password credential", styles['TableCell'])]
    ]
    usr_table = Table(usr_schema_data, colWidths=[110, 80, 140, 186])
    usr_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(usr_table)
    story.append(PageBreak())
    return story

def build_page_29(styles):
    """Page 29: Chapter 4: System Design - Database Schema Design (Part 2) & Indexing"""
    story = []
    story.append(Paragraph("CHAPTER 4: SYSTEM DESIGN (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("4.11 Physical Database Schema Specification (Part 2)", styles['SectionTitle']))
    
    # Table 4.4: Attendance Schema
    story.append(Paragraph("<b>Collection: `attendances` (Subject-Wise Attendance)</b>", styles['SubsectionTitle']))
    att_schema_data = [
        [Paragraph("<b>Field Name</b>", styles['TableHeader']), Paragraph("<b>BSON Data Type</b>", styles['TableHeader']), Paragraph("<b>Constraints / Rules</b>", styles['TableHeader']), Paragraph("<b>Field Description & Semantics</b>", styles['TableHeader'])],
        [Paragraph("`studentId`", styles['TableCellBold']), Paragraph("ObjectId", styles['TableCell']), Paragraph("Required, Ref: 'Admission'", styles['TableCell']), Paragraph("Foreign key referencing admitted student document", styles['TableCell'])],
        [Paragraph("`subject`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, Trimmed", styles['TableCell']), Paragraph("Academic subject course title", styles['TableCell'])],
        [Paragraph("`totalClasses`", styles['TableCellBold']), Paragraph("Number", styles['TableCell']), Paragraph("Default: 0, Min: 0", styles['TableCell']), Paragraph("Total lecture sessions conducted to date", styles['TableCell'])],
        [Paragraph("`classesPresent`", styles['TableCellBold']), Paragraph("Number", styles['TableCell']), Paragraph("Default: 0, Min: 0", styles['TableCell']), Paragraph("Cumulative lecture sessions attended by student", styles['TableCell'])],
        [Paragraph("`percentage`", styles['TableCellBold']), Paragraph("Number", styles['TableCell']), Paragraph("Default: 100, 0-100 range", styles['TableCell']), Paragraph("Computed metric: round((Present/Total)*100)", styles['TableCell'])],
        [Paragraph("`status`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Default: 'Eligible', Enum: [Eligible, Shortage]", styles['TableCell']), Paragraph("Statutory examination compliance flag (&ge; 75%)", styles['TableCell'])]
    ]
    att_table = Table(att_schema_data, colWidths=[105, 80, 145, 186])
    att_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(att_table)
    story.append(Spacer(1, 3))
    
    # Table 4.5: Marks Schema
    story.append(Paragraph("<b>Collection: `marks` (Continuous Internal Evaluation & Finals)</b>", styles['SubsectionTitle']))
    marks_schema_data = [
        [Paragraph("<b>Field Name</b>", styles['TableHeader']), Paragraph("<b>BSON Data Type</b>", styles['TableHeader']), Paragraph("<b>Constraints / Rules</b>", styles['TableHeader']), Paragraph("<b>Field Description & Semantics</b>", styles['TableHeader'])],
        [Paragraph("`studentId`", styles['TableCellBold']), Paragraph("ObjectId", styles['TableCell']), Paragraph("Required, Ref: 'Admission'", styles['TableCell']), Paragraph("Foreign key referencing admitted student document", styles['TableCell'])],
        [Paragraph("`examType`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, Enum: ['IA-1','IA-2','IA-3','Sem End']", styles['TableCell']), Paragraph("Examination classification category", styles['TableCell'])],
        [Paragraph("`semester`, `subject`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, Trimmed", styles['TableCell']), Paragraph("Academic semester level and course title", styles['TableCell'])],
        [Paragraph("`marksObtained`, `maxMarks`", styles['TableCellBold']), Paragraph("Number", styles['TableCell']), Paragraph("Required, marksObtained &le; maxMarks", styles['TableCell']), Paragraph("Quantitative assessment scores", styles['TableCell'])],
        [Paragraph("`status`", styles['TableCellBold']), Paragraph("String", styles['TableCell']), Paragraph("Required, Enum: ['Pass', 'Fail']", styles['TableCell']), Paragraph("Threshold outcome based on 40% criteria", styles['TableCell'])]
    ]
    marks_table = Table(marks_schema_data, colWidths=[105, 80, 145, 186])
    marks_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor('#FFFFFF'), BG_LIGHT]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(marks_table)
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("4.12 Database Indexing and Performance Optimization Strategy", styles['SectionTitle']))
    idx_p = (
        "To guarantee sub-300ms read performance under heavy concurrent queries, the following indexing strategy is implemented: "
        "(1) <b>Compound Index on Attendance:</b> `{ studentId: 1, subject: 1 }` with unique constraint to prevent duplicate subject records per student; "
        "(2) <b>Unique Sparse Index on Admissions:</b> `{ aadhaarNumber: 1 }` preventing multiple applications with the same Aadhaar; "
        "(3) <b>Sparse Unique Index on Users:</b> `{ teacherId: 1 }` and `{ studentAadhaar: 1 }` ensuring fast authentication lookups; and "
        "(4) <b>TTL (Time-To-Live) Index on Otp:</b> `{ createdAt: 1 }` with an expiry threshold of 300 seconds (5 minutes) for automatic OTP cleanup."
    )
    story.append(Paragraph(idx_p, styles['Body']))
    story.append(PageBreak())
    return story

def build_page_30(styles):
    """Page 30: Chapter 4: System Design - Component Hierarchy & State Lifecycles"""
    story = []
    story.append(Paragraph("CHAPTER 4: SYSTEM DESIGN (CONTD.)", styles['ChapterTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))
    
    story.append(Paragraph("4.13 Frontend React Component Hierarchy", styles['SectionTitle']))
    p_comp = (
        "The client-side architecture is built upon a modular component hierarchy that cleanly segregates operational responsibilities. "
        "Figure 4.4 illustrates the component containment and data-passing structure of the application."
    )
    story.append(Paragraph(p_comp, styles['Body']))
    story.append(Spacer(1, 2))
    
    # Component Hierarchy Card Table
    comp_tree_data = [
        [Paragraph("<b>Root App Component (`App.jsx` / `ParentsApp.jsx` / `TeacherApp.jsx`)</b>", styles['TableHeader'])],
        [Paragraph(
            "&boxur;&HorizontalLine; <b>AuthScreen.jsx</b> &mdash; Manages Dual-Role Login, Aadhaar Validation & OTP Modals<br/>"
            "&boxur;&HorizontalLine; <b>CollegeHome.jsx / AboutUs.jsx / ContactUs.jsx</b> &mdash; Public Portal, Faculty Directory & Inquiries<br/>"
            "&boxur;&HorizontalLine; <b>StatusPortal.jsx</b> &mdash; Unauthenticated Public Admission Application Status Lookup<br/>"
            "&boxur;&HorizontalLine; <b>Admission Pipeline Engine</b><br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&HorizontalLine; <b>FormStep1.jsx</b> &mdash; Personal Demographics, Addresses & Aadhaar Deduplication<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&HorizontalLine; <b>FormStep2.jsx</b> &mdash; Multi-Board Academic Scores (SSLC/PUC/CBSE) & Auto-Percentage<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&HorizontalLine; <b>FormStep3.jsx</b> &mdash; Multipart Document Upload (Aadhaar, Caste, Marks Cards, Signatures)<br/>"
            "&boxur;&HorizontalLine; <b>AdminDashboard.jsx</b> &mdash; Application Review, UUCMS/Roll No Allocation & Decision Dispatch<br/>"
            "&boxur;&HorizontalLine; <b>Faculty Academic Workspace</b><br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&HorizontalLine; <b>AttendanceEntry.jsx</b> &mdash; Subject-Wise Single & Bulk Class Attendance Matrix<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&HorizontalLine; <b>MarksEntry.jsx</b> &mdash; Continuous Assessment Scores (IA-1, IA-2, IA-3, Sem Finals)<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&HorizontalLine; <b>BehaviorEntry.jsx</b> &mdash; 5-Scale Conduct Evaluation & Domain Feedback Logging<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&HorizontalLine; <b>ComplaintEntry.jsx</b> &mdash; Disciplinary Incident Filing & Severity Escalation<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;&boxur;&HorizontalLine; <b>NoticeEntry.jsx</b> &mdash; Event Broadcast (Hackathon, Sports, Cultural, Academic)<br/>"
            "&boxur;&HorizontalLine; <b>StudentInfoPortal.jsx</b> &mdash; Real-Time Guardian Dashboard with Progress Radar & Alerts",
            styles['TableCellBold']
        )]
    ]
    comp_tree_table = Table(comp_tree_data, colWidths=[516])
    comp_tree_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BACKGROUND', (0,1), (-1,-1), HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(comp_tree_table)
    story.append(Paragraph("<b>Figure 4.4:</b> Complete Modular React Component Hierarchy and Data Routing Pipeline", styles['FigureCaption']))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("4.14 State Transition Lifecycles", styles['SectionTitle']))
    story.append(Paragraph(
        "<b>1. Admission Lifecycle:</b> `[Form Submitted]` &rarr; State set to <i>'Pending'</i> &rarr; Administrative Document Audit &rarr; "
        "Either <i>'Approved'</i> (triggers UUCMS/Roll No assignment & congratulations email) or <i>'Rejected'</i> (requires rejection reason & explanation email).<br/>"
        "<b>2. Attendance Eligibility Lifecycle:</b> `[Class Log Submitted]` &rarr; Computes Percentage &rarr; If $\\ge 75\\%$, transitions to <i>'Eligible'</i>; "
        "if $&lt; 75\\%$, transitions to <i>'Shortage'</i> &rarr; Triggers automated transaction warning dispatch to parent email.<br/>"
        "<b>3. Disciplinary Lifecycle:</b> `[Incident Logged]` &rarr; Tagged with Severity (Low/Medium/High) &rarr; Action set to <i>'Parent Notification Sent'</i> "
        "&rarr; High Severity triggers immediate email &rarr; Administrative Resolution updates state to <i>'Resolved'</i>.",
        styles['Body']
    ))
    story.append(PageBreak())
    return story
