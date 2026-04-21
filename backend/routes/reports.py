from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from predictor.models import Patient
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import io
import json
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend

router = APIRouter(prefix="/reports", tags=["reports"])

def create_risk_gauge_chart():
    """Create a risk gauge chart as an image"""
    fig, ax = plt.subplots(figsize=(6, 4))
    categories = ['Low Risk\n(0-30%)', 'Moderate Risk\n(30-60%)', 'High Risk\n(60-100%)']
    values = [1, 1, 1]
    colors_list = ['#10b981', '#f59e0b', '#ef4444']
    
    ax.barh(categories, [100, 100, 100], color=colors_list, alpha=0.3)
    ax.set_xlim(0, 100)
    ax.set_xlabel('Risk Percentage (%)', fontsize=11, fontweight='bold')
    ax.set_title('Risk Classification Scale', fontsize=13, fontweight='bold', pad=15)
    ax.grid(axis='x', alpha=0.3)
    
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight')
    img_buffer.seek(0)
    plt.close()
    return img_buffer

def create_shap_chart(shap_values_dict):
    """Create SHAP values visualization"""
    if not shap_values_dict:
        return None
    
    features = list(shap_values_dict.keys())[:7]  # Top 7 features
    values = [abs(shap_values_dict[f]) for f in features]
    
    fig, ax = plt.subplots(figsize=(8, 5))
    colors_list = ['#ef4444' if shap_values_dict[f] > 0 else '#10b981' for f in features]
    
    ax.barh(features, values, color=colors_list, alpha=0.7)
    ax.set_xlabel('SHAP Value (Feature Importance)', fontsize=11, fontweight='bold')
    ax.set_title('Feature Importance Analysis (SHAP Values)', fontsize=13, fontweight='bold', pad=15)
    ax.invert_yaxis()
    ax.grid(axis='x', alpha=0.3)
    
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight')
    img_buffer.seek(0)
    plt.close()
    return img_buffer

def create_patient_metrics_chart(patient):
    """Create patient vital metrics visualization"""
    metrics = ['BMI', 'Glucose\n(mg/dL)', 'Blood\nPressure', 'Chronic\nIllnesses', 'Previous\nAdmissions']
    values = [
        patient.bmi or 0,
        (patient.glucose or 0) / 50,  # Scale for visibility
        (patient.blood_pressure or 0) / 5,  # Scale for visibility
        patient.chronic_illnesses or 0,
        patient.previous_admissions or 0
    ]
    
    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.bar(metrics, values, color=['#3b82f6', '#ef4444', '#f59e0b', '#ec4899', '#8b5cf6'], alpha=0.7)
    
    ax.set_ylabel('Value (Normalized)', fontsize=11, fontweight='bold')
    ax.set_title('Patient Clinical Metrics Overview', fontsize=13, fontweight='bold', pad=15)
    ax.grid(axis='y', alpha=0.3)
    
    # Add value labels on bars
    for i, (bar, val) in enumerate(zip(bars, values)):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{values[i]:.1f}', ha='center', va='bottom', fontsize=9, fontweight='bold')
    
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight')
    img_buffer.seek(0)
    plt.close()
    return img_buffer

@router.get("/download/{patient_id}")
def download_report(patient_id: str):
    try:
        patient = Patient.objects.get(patient_id=patient_id)
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Create PDF in memory using Platypus for better layout
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=0.75*inch, leftMargin=0.75*inch,
                            topMargin=0.75*inch, bottomMargin=0.75*inch)
    
    story = []
    styles = getSampleStyleSheet()
    
    # Professional Title Style
    title_style = ParagraphStyle(
        'CustomTitle',
        fontName='Times-Bold',
        fontSize=26,
        textColor=colors.HexColor('#1e3a8a'),
        spaceAfter=4,
        alignment=TA_CENTER,
        leading=32
    )
    
    # Professional Subtitle Style
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        fontName='Times-Roman',
        fontSize=12,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8,
        alignment=TA_CENTER,
        leading=14
    )
    
    # Professional Section Header Style
    demo_style = ParagraphStyle(
        'SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=12,
        alignment=TA_CENTER,
        spaceBefore=12
    )
    
    # Professional Body Style
    body_style = ParagraphStyle(
        'CustomBody',
        fontName='Times-Roman',
        fontSize=11,
        textColor=colors.HexColor('#1f2937'),
        alignment=TA_CENTER,
        spaceAfter=10,
        leading=14
    )
    
    # Title
    story.append(Paragraph("AROGYANETRA CLINICAL REPORT", title_style))
    story.append(Paragraph("Readmission Risk Analysis & Clinical Decision Support System", subtitle_style))
    story.append(Spacer(1, 0.12*inch))
    
    # Patient Demographics Section
    story.append(Paragraph("PATIENT DEMOGRAPHICS", demo_style))
    story.append(Spacer(1, 0.06*inch))
    
    demo_data = [
        ['Patient ID', patient.patient_id, 'Name', patient.name or 'N/A', 'Location', patient.location or 'N/A'],
        ['Age', f'{patient.age} years', 'Gender', patient.gender, 'BMI', f'{patient.bmi:.1f}' if patient.bmi else 'N/A'],
        ['Length of Stay', f'{patient.length_of_stay} days', 'Chronic Illnesses', f'{patient.chronic_illnesses}', 
         'Previous Admissions', f'{patient.previous_admissions}'],
        ['Glucose Level', f'{patient.glucose:.0f} mg/dL' if patient.glucose else 'N/A', 
         'Blood Pressure', f'{patient.blood_pressure:.0f} mmHg' if patient.blood_pressure else 'N/A',
         'Discharge Disposition', patient.discharge_disposition or 'N/A']
    ]
    
    demo_table = Table(demo_data, colWidths=[1.3*inch]*6)
    demo_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f4f8')])
    ]))
    story.append(demo_table)
    story.append(Spacer(1, 0.15*inch))
    
    # Risk Assessment Section
    story.append(Paragraph("RISK ASSESSMENT RESULT", demo_style))
    story.append(Spacer(1, 0.06*inch))
    
    risk_score = patient.risk_score or 0
    risk_label = "High Risk" if risk_score > 60 else ("Moderate Risk" if risk_score > 30 else "Low Risk")
    risk_color = '#dc2626' if risk_score > 60 else ('#f59e0b' if risk_score > 30 else '#059669')
    
    risk_text = f"""
    <font face="Times-Bold" size="14" color="{risk_color}">Risk Score: {risk_score:.2f}%</font><br/>
    <br/>
    <font face="Times-Roman" size="11">
    <b>Classification:</b> {risk_label}<br/>
    <b>Assessment Date:</b> {patient.updated_at.strftime('%B %d, %Y') if patient.updated_at else 'Pending'}<br/>
    <br/>
    <b>Clinical Interpretation:</b><br/>
    This patient presents a <font color="{risk_color}"><b>{risk_label}</b></font> probability of hospital readmission 
    within 30 days of discharge. <b>Clinical Action Required: {'URGENT INTERVENTION RECOMMENDED' if risk_score > 60 else 'RECOMMENDED MONITORING' if risk_score > 30 else 'STANDARD FOLLOW-UP'}</b>
    </font>
    """
    story.append(Paragraph(risk_text, body_style))
    story.append(Spacer(1, 0.08*inch))
    
    # Add metrics chart centered
    metrics_img = create_patient_metrics_chart(patient)
    if metrics_img:
        img = Image(metrics_img, width=5.5*inch, height=3.25*inch)
        img.hAlign = 'CENTER'
        story.append(img)
        story.append(Spacer(1, 0.1*inch))
    
    # Feature Importance Analysis
    story.append(Paragraph("FEATURE IMPORTANCE ANALYSIS", demo_style))
    story.append(Paragraph("(SHAP - SHapley Additive exPlanations)", subtitle_style))
    story.append(Spacer(1, 0.06*inch))
    
    if patient.shap_values:
        shap_intro = """
        <font face="Times-Roman" size="10">
        SHAP analysis provides a unified measure of feature importance in machine learning models.
        Below are the key clinical factors influencing the readmission risk prediction:<br/><br/>
        <b style="color:#dc2626">RED (Positive SHAP):</b> Features that increase readmission probability<br/>
        <b style="color:#059669">GREEN (Negative SHAP):</b> Features that decrease readmission probability
        </font>
        """
        story.append(Paragraph(shap_intro, body_style))
        story.append(Spacer(1, 0.08*inch))
        
        # Add SHAP chart centered
        shap_img = create_shap_chart(patient.shap_values)
        if shap_img:
            img = Image(shap_img, width=5.5*inch, height=3.25*inch)
            img.hAlign = 'CENTER'
            story.append(img)
            story.append(Spacer(1, 0.1*inch))
        
        # Detailed SHAP explanations
        story.append(Paragraph("DETAILED FEATURE ANALYSIS", demo_style))
        story.append(Spacer(1, 0.06*inch))
        
        shap_details = [['Feature', 'SHAP Value', 'Direction', 'Impact Level']]
        shap_dict = patient.shap_values if isinstance(patient.shap_values, dict) else {}
        sorted_shap = sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True) if shap_dict else []
        
        for feature, value in sorted_shap[:7]:  # Top 7 features
            direction = "↑ Increases Risk" if value > 0 else "↓ Decreases Risk"
            impact = "CRITICAL" if abs(value) > 1 else "HIGH" if abs(value) > 0.5 else "MODERATE"
            shap_details.append([
                f"{feature.replace('_', ' ').title()}",
                f"{value:.4f}",
                direction,
                impact
            ])
        
        shap_table = Table(shap_details, colWidths=[2*inch, 1.2*inch, 1.5*inch, 1.3*inch])
        shap_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f4f8')])
        ]))
        story.append(shap_table)
        story.append(Spacer(1, 0.35*inch))
    
    # Clinical Recommendations
    story.append(Paragraph("CLINICAL RECOMMENDATIONS", demo_style))
    story.append(Spacer(1, 0.06*inch))
    if patient.recommendations:
        recommendation_data = []
        
        for i, rec in enumerate(patient.recommendations, 1):
            # Handle both dictionary and string formats
            if isinstance(rec, dict):
                category = rec.get('category', 'Action')
                recommendation = rec.get('recommendation', str(rec))
            else:
                category = 'Clinical Action'
                recommendation = str(rec)
            
            recommendation_data.append([
                f"<b>{i}. {category}</b>",
                recommendation
            ])
        
        # Create recommendations table
        rec_table = Table(recommendation_data, colWidths=[1.5*inch, 4.5*inch])
        rec_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (-1, -1), 'Times-Roman'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f4f8')]),
            ('LINESTYLE', (0, 0), (-1, -1), 1),
            ('LINEWIDTH', (0, 0), (-1, -1), 1),
            ('TOPPADDING', (0, 1), (-1, -1), 15),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 15),
        ]))
        story.append(rec_table)
    else:
        default_rec = """
        <font face="Times-Roman" size="11">
        <b>1. Follow-up Care</b><br/>
        Standard discharge follow-up call within 72 hours to assess patient recovery and medication compliance.<br/>
        <br/>
        <b>2. Monitoring Protocol</b><br/>
        Implement home-based monitoring with scheduled outpatient visits to track clinical parameters.<br/>
        <br/>
        <b>3. Patient Education</b><br/>
        Provide comprehensive disease management education and lifestyle counseling at discharge.
        </font>
        """
        story.append(Paragraph(default_rec, body_style))
    
    story.append(Spacer(1, 0.3*inch))
    
    # Summary and Footer
    summary_text = f"""
    <font face="Times-Roman" size="9"><b>REPORT SUMMARY</b><br/>
    This comprehensive readmission risk analysis was generated using advanced machine learning algorithms 
    and explainable AI (SHAP) techniques. The predictive model has been trained on comprehensive historical 
    patient data to provide accurate 30-day readmission probability assessments.<br/>
    <br/>
    <b>Risk Classification:</b> <font color="{risk_color}"><b>{risk_label}</b></font> | 
    <b>Confidence Score:</b> {risk_score:.2f}%<br/>
    <i>Clinical decision support only. Review with qualified healthcare professionals.</i>
    </font>
    """
    story.append(Paragraph(summary_text, body_style))
    
    story.append(Spacer(1, 0.08*inch))
    # Professional Footer
    footer_style = ParagraphStyle(
        'Footer',
        fontName='Times-Italic',
        fontSize=8,
        textColor=colors.HexColor('#64748b'),
        alignment=TA_CENTER
    )
    story.append(Paragraph("_______________________________________________________________", footer_style))
    story.append(Paragraph("Confidential Healthcare Information | HIPAA Compliant | ArogyaNetra System", footer_style))
    story.append(Paragraph(f"Patient ID: {patient_id} | Generated: {patient.created_at.strftime('%Y-%m-%d %H:%M:%S') if patient.created_at else 'N/A'}", footer_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    
    return Response(buffer.getvalue(), media_type="application/pdf",
                    headers={"Content-Disposition": f"attachment; filename=Patient_{patient_id}_Report.pdf"})