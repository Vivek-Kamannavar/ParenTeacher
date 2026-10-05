# generate_report.py
# Main Orchestration Script to Compile the 40-Page ParenTeacher Technical Project Report
import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate
import pypdf

from report_styles import get_report_styles, NumberedCanvas
import report_pages_ch1_ch2 as p_part1
import report_pages_ch3_ch4 as p_part2
import report_pages_ch5_ch8 as p_part3

def generate_pdf(output_filename="ParenTeacher_Complete_Project_Report.pdf"):
    print(f"Initializing document template for {output_filename}...")
    
    # 612 x 792 pt (Letter size)
    # Margins: 48 pt left, 48 pt right, 54 pt top, 54 pt bottom
    # Content area width = 612 - 96 = 516 pt
    # Content area height = 792 - 108 = 684 pt
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=48,
        rightMargin=48,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = get_report_styles()
    story = []
    
    # Page Builders Map: Exactly 40 Pages
    page_builders = [
        # Part 1: Pages 1 to 14
        ("Page 1: Title / Cover Page", p_part1.build_page_1),
        ("Page 2: Certificate & Declaration", p_part1.build_page_2),
        ("Page 3: Acknowledgements & Abstract", p_part1.build_page_3),
        ("Page 4: Table of Contents & Lists", p_part1.build_page_4),
        ("Page 5: Chapter 1 - Background & Context", p_part1.build_page_5),
        ("Page 6: Chapter 1 - Problem Statement & Bottlenecks", p_part1.build_page_6),
        ("Page 7: Chapter 1 - Objectives & Scope", p_part1.build_page_7),
        ("Page 8: Chapter 1 - System Overview & Organization", p_part1.build_page_8),
        ("Page 9: Chapter 2 - Literature Survey (Papers 1 & 2)", p_part1.build_page_9),
        ("Page 10: Chapter 2 - Literature Survey (Papers 3, 4, 5)", p_part1.build_page_10),
        ("Page 11: Chapter 2 - Comparative Literature Matrix", p_part1.build_page_11),
        ("Page 12: Chapter 2 - Existing System & Bottlenecks", p_part1.build_page_12),
        ("Page 13: Chapter 2 - Proposed Architecture & Innovations", p_part1.build_page_13),
        ("Page 14: Chapter 2 - Multi-Dimensional Feasibility", p_part1.build_page_14),
        
        # Part 2: Pages 15 to 30
        ("Page 15: Chapter 3 - SRS & Hardware Specifications", p_part2.build_page_15),
        ("Page 16: Chapter 3 - Software Stack Justification", p_part2.build_page_16),
        ("Page 17: Chapter 3 - FR: Admission Pipeline", p_part2.build_page_17),
        ("Page 18: Chapter 3 - FR: Attendance & 75% Rule", p_part2.build_page_18),
        ("Page 19: Chapter 3 - FR: Continuous Assessment & Marks", p_part2.build_page_19),
        ("Page 20: Chapter 3 - FR: Behavior & Incident Complaints", p_part2.build_page_20),
        ("Page 21: Chapter 3 - FR: Notices & Parent Dashboard", p_part2.build_page_21),
        ("Page 22: Chapter 3 - Non-Functional Requirements", p_part2.build_page_22),
        ("Page 23: Chapter 3 - Operational & External Interfaces", p_part2.build_page_23),
        ("Page 24: Chapter 4 - Multi-Tier MVC Architecture", p_part2.build_page_24),
        ("Page 25: Chapter 4 - DFD Level 0 (Context Diagram)", p_part2.build_page_25),
        ("Page 26: Chapter 4 - DFD Level 1 (Decomposition)", p_part2.build_page_26),
        ("Page 27: Chapter 4 - Entity-Relationship (E-R) Diagram", p_part2.build_page_27),
        ("Page 28: Chapter 4 - DB Schema: Admissions & Users", p_part2.build_page_28),
        ("Page 29: Chapter 4 - DB Schema: Marks & Attendance", p_part2.build_page_29),
        ("Page 30: Chapter 4 - Component Hierarchy & Lifecycles", p_part2.build_page_30),
        
        # Part 3: Pages 31 to 40
        ("Page 31: Chapter 5 - Server Architecture & Resilience", p_part3.build_page_31),
        ("Page 32: Chapter 5 - REST API Endpoints Specification", p_part3.build_page_32),
        ("Page 33: Chapter 5 - Automated Notification Pipeline", p_part3.build_page_33),
        ("Page 34: Chapter 5 - Frontend React Engineering & UX", p_part3.build_page_34),
        ("Page 35: Chapter 6 - Testing Methodology & Levels", p_part3.build_page_35),
        ("Page 36: Chapter 6 - Test Suite 1: Auth & Admissions", p_part3.build_page_36),
        ("Page 37: Chapter 6 - Test Suite 2: Attendance & Marks", p_part3.build_page_37),
        ("Page 38: Chapter 6 - Test Suite 3: Behavior & Alerts", p_part3.build_page_38),
        ("Page 39: Chapter 7 - Results & Performance Benchmarks", p_part3.build_page_39),
        ("Page 40: Chapter 8 - Conclusion & Bibliography", p_part3.build_page_40)
    ]
    
    print(f"Assembling flowables across {len(page_builders)} planned pages...")
    for idx, (name, builder) in enumerate(page_builders):
        page_flowables = builder(styles)
        story.extend(page_flowables)
    
    print("Building PDF with custom NumberedCanvas...")
    doc.build(story, canvasmaker=NumberedCanvas)
    print("Build complete!")
    
    # Verify with pypdf
    reader = pypdf.PdfReader(output_filename)
    actual_pages = len(reader.pages)
    print(f"==================================================")
    print(f"VERIFICATION RESULT: Actual PDF Page Count = {actual_pages}")
    print(f"==================================================")
    
    if actual_pages == 40:
        print("PERFECT: Document matches exactly the 40-page target!")
    else:
        print(f"NOTE: Document generated with {actual_pages} pages.")

if __name__ == "__main__":
    generate_pdf()
