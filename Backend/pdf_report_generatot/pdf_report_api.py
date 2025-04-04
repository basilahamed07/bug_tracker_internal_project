from flask import Flask, send_file,jsonify,request
import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO
import numpy as np
from routers.view_matric import get_values_df,load_all_data_set
from models import Metrics,Project_details,Testers,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus
from datetime import datetime
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

# api key for pdf generTOR  = 3e143dda4408e55dbc0b299480b824ef1724d7ebf03bf6d08fd24801601b461d

# 1) and 2  get the project detals accoding to the project name

def project_details(id):

        
    project_details = Project_details.query.filter_by(project_name_id=id).first()
    tester_details = Testers.query.filter_by(project_name_id=id).all()
    tester_details = [trash.to_dict() for trash in tester_details]
    return {"project_details":project_details.to_dict(),"tester_details":tester_details}



# 3 test excecucation status 

def test_excecution_status(id, month):
    # to get the all the test details by using the project_name_id
    # to get the project name 
    project_name = Project_name.query.get_or_404(id)
    project_name = project_name.project_name
    list_of_databsae = [New_defects, Test_execution_status, Total_Defect_Status, BuildStatus, DefectAcceptedRejected, TestCaseCreationStatus]
    filter_data = []
    
    # Get the data from all the databases
    for trash in list_of_databsae:
        temp_variable = trash.query.filter_by(project_name_id=id).all()
        filter_data.append(temp_variable)
    
    dict_collection = []
    for trash in filter_data:
        temp_dict = []
        for trash1 in trash:
            temp_dict.append(trash1.to_dict())
        dict_collection.append(temp_dict)
    
    dataframe_collection = []
    for trash in dict_collection:
        temp_df = pd.DataFrame.from_dict(trash)
        temp_df['date'] = pd.to_datetime(temp_df['date'], format='%d-%m-%Y')
        temp_df['Year'] = temp_df['date'].dt.year
        temp_df['Week'] = temp_df['date'].dt.isocalendar().week
        temp_df['Month'] = temp_df['date'].dt.month
        dataframe_collection.append(temp_df)

    collection_dataframe_month = []
    for trash in dataframe_collection:
        # Filter by the specified month
        temp_df = trash[trash["Month"] == month]

        # Sort the filtered DataFrame by the 'date' column in descending order
        temp_df_sorted = temp_df.sort_values(by='date', ascending=False)
        
        # Select the latest 3 records
        latest_three = temp_df_sorted.head(1)
        
        # Append the latest three records to the collection
        collection_dataframe_month.append(latest_three)
    
    return collection_dataframe_month


def create_plotly_chart_month(df_this_month, df_previous_month, title, month, chart_type='line'):
    """Create a plotly chart comparing this month's and previous month's data and save it as an image"""
    
    # Ensure both DataFrames are handled
    if isinstance(df_this_month, pd.Series):
        df_this_month = df_this_month.to_frame()  # Convert Series to DataFrame
    
    if isinstance(df_previous_month, pd.Series):
        df_previous_month = df_previous_month.to_frame()  # Convert Series to DataFrame

    # Initialize the plot
    fig = go.Figure()

    # Add the trace for this month's data
    for column in df_this_month.select_dtypes(include=[np.number]).columns:
        fig.add_trace(go.Scatter(
            x=df_this_month.index,
            y=df_this_month[column],
            name=f"{month} - {column}",
            mode='lines+markers',
            line=dict(color='blue')  # You can customize the color
        ))

    # Add the trace for previous month's data
    for column in df_previous_month.select_dtypes(include=[np.number]).columns:
        fig.add_trace(go.Scatter(
            x=df_previous_month.index,
            y=df_previous_month[column],
            name=f"Previous Month - {column}",
            mode='lines+markers',
            line=dict(color='red', dash='dash')  # Customize color and line style
        ))

    # Update layout with title and axis labels
    fig.update_layout(
        title=title,
        xaxis_title="Date",
        yaxis_title="Value",
        height=600,
        width=1200,
        showlegend=True
    )

    # Save the plot as a PNG image
    img_bytes = pio.to_image(fig, format='png')
    return BytesIO(img_bytes)





def create_plotly_chart(df, title, chart_type='line'):
    """Create a plotly chart and save it as an image"""
    
    # Ensure df is a DataFrame
    if isinstance(df, pd.Series):
        df = df.to_frame()  # Convert Series to DataFrame
    
    if chart_type == 'line':
        fig = go.Figure()
        for column in df.select_dtypes(include=[np.number]).columns:
            fig.add_trace(go.Scatter(
                x=df.index,
                y=df[column],
                name=column,
                mode='lines+markers'
            ))
    elif chart_type == 'bar':
        fig = go.Figure(data=[
            go.Bar(name=column, x=df.index, y=df[column])
            for column in df.select_dtypes(include=[np.number]).columns
        ])

    fig.update_layout(
        title=title,
        xaxis_title="Date",
        yaxis_title="Value",
        height=400,
        width=800,
        showlegend=True
    )

    # Save the plot as a PNG image
    img_bytes = pio.to_image(fig, format='png')
    return BytesIO(img_bytes)

def get_project_name(id):
    name_project = Project_name.query.filter_by(id=id).first()
    return name_project.project_name


def create_table_content(df):
    """Convert DataFrame to a format suitable for ReportLab table with smaller size, excluding the index column."""
    # Drop the index column if it exists
    df = df.reset_index(drop=True)
    
    # Rename columns: replace underscores with spaces, and specifically rename 'project_name_id' to 'project name'
    df.columns = df.columns.str.replace('project name_id', 'project name')
    df.columns = [col.replace('_', ' ') for col in df.columns]
    
    
    data = []
    
    # Convert DataFrame values to list format, excluding index column
    for row in df.values.tolist():
        processed_row = []
        for cell in row:
            # If the cell is a list, return its length; if it's empty, return None
            if isinstance(cell, list):
                processed_row.append(len(cell))  # Get the length of the list
            elif not cell:  # If the cell is None or an empty value
                processed_row.append('None')  # Add 'None' for empty cells
            else:
                processed_row.append(str(cell))  # Convert to string for consistent formatting
        data.append(processed_row)
    
    # Insert header row
    data.insert(0, df.columns.tolist())
    
    # Create table style with navy blue theme
    style = TableStyle([
        # Header row styles
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#000080')),  # Navy blue background for header
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),            # Set text color for header
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),                         # Center-align header text
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),              # Set font for header
        ('FONTSIZE', (0, 0), (-1, 0), 8),                             # Set smaller font size for header
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),                        # Reduced padding for header
        
        # Data rows styles
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0f8ff')), # Light blue background for data rows
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),               # Set text color for data rows
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),                  # Set font for data rows
        ('FONTSIZE', (0, 1), (-1, -1), 7),                            # Set smaller font size for data rows
        ('BOTTOMPADDING', (0, 1), (-1, -1), 5),                       # Reduced padding for data rows
        ('TOPPADDING', (0, 1), (-1, -1), 5),                          # Reduced top padding for data rows
        ('GRID', (0, 0), (-1, -1), 1, colors.black),                  # Add gridlines to the table
        
        # Center-align the entire table content (data and header)
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),                        # Center-align all table content
        
        # Vertical alignment for content
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),                      # Vertically align all content in the middle
        
        # Align numeric columns to the right (adjust this if you need other columns to align differently)
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),                        # Align numeric columns (from second column onward)
        
        # Adjust column width dynamically based on content (this can be adjusted)
        ('COLWIDTHS', (0, 0), (-1, -1), 50),                          # Set column width for the whole table
    ])
    
    return data, style



def month_name_to_number(month_name):
    months = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    }
    return months.get(month_name.capitalize(), "Invalid month name")



from flask import send_file

def pdf_router(app):
    @app.route('/generate_pdf/<int:id>', methods=["POST"])
    def generate_pdf(id):
        # Create sample DataFrames (replace with your actual data)
        # 1) get the project detail of the table and billable and non billable data

        data = request.json

        matrix_values = Metrics.query.filter_by(project_name_id=id, month=data["month"]).all()
        print("matrix_values", matrix_values)
        print("matrix_values", len(matrix_values))
        if len(matrix_values) == 0: 
            print("inside the function")
            return jsonify("No data found for the selected month."),500

        project_details_table = project_details(id)
        project_details_table_pd = pd.DataFrame([project_details_table["project_details"]])
        tester_details_table_pd = pd.DataFrame([project_details_table["tester_details"]])

        project_details_table_pd = project_details_table_pd.drop(columns=['user_id', 'id'])
        project_details_table_pd["project_name_id"] = get_project_name(id)

        matrix_values = Metrics.query.filter_by(project_name_id=id).all()
        matrix_values = get_values_df(matrix_values)
        month = month_name_to_number(data["month"])

        test_excecution_status_dict = test_excecution_status(id, month)

        collecion_test_details = []
        for trash in test_excecution_status_dict:
            trash = trash.drop(columns=['user_id', 'id', "Week", "Month"])
            trash["project_name_id"] = get_project_name(id)
            collecion_test_details.append(trash)

        test_excecution_status_name = ["New defects", "Test execution status", "Total Defect Status", "Build Status", "Defect Accepted Rejected", "Test Case Creation Status"]

        # Month calculations for previous and current month
        month_2 = 0
        if month == 1:
            month_2 = 12
        else:
            month_2 = month - 1

        first_month = matrix_values[matrix_values["month"] == month]
        second_month = matrix_values[matrix_values["month"] == month_2]

        first_month = first_month[[
            "defectleakage", "defectdensity", "defectremovalefficiency", "automationcoverage",
            "testcasesefficiency", "testerproductivity", "defectseverityindex", "defectfixrate",
            "defectrejectionratio", "meantimetofinddefect", "meantimetorepair"
        ]].sum()

        second_month = second_month[[
            "defectleakage", "defectdensity", "defectremovalefficiency", "automationcoverage",
            "testcasesefficiency", "testerproductivity", "defectseverityindex", "defectfixrate",
            "defectrejectionratio", "meantimetofinddefect", "meantimetorepair"
        ]].sum()

        # Create PDF buffer
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=landscape(letter),
            rightMargin=30,
            leftMargin=30,
            topMargin=30,
            bottomMargin=30
        )

        # Create the story (content) for the PDF
        story = []
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30
        )

        # Add main title
        # story.append(Paragraph("Analytics Report", title_style))
        # story.append(Spacer(1, 20))

        # # Add project details
        # project_details_table_content, project_details_table_content_style = create_table_content(project_details_table_pd.reset_index())
        # story.append(Paragraph("Project Details", styles['Heading2']))
        # story.append(Table(project_details_table_content, style=project_details_table_content_style))
        # story.append(Spacer(1, 20))

        # # Add monthly chart
        # story.append(Paragraph("Monthly Metrics", styles['Heading2']))
        # monthly_chart = create_plotly_chart_month(first_month, second_month, f"{data['month']} Metrics Trend", data["month"])
        # story.append(Image(monthly_chart, width=500, height=300))
        # story.append(Spacer(1, 20))

        # # Add tester details tables
        # for trash, trash2 in zip(collecion_test_details, test_excecution_status_name):
        #     monthly_data, monthly_style = create_table_content(trash.reset_index())
        #     story.append(Paragraph(f" {trash2} Test Details", styles['Heading2']))
        #     story.append(Table(monthly_data, style=monthly_style))
        #     story.append(Spacer(1, 30))

        # # Matrix details
        # project_details_table_content, project_details_table_content_style = create_table_content(first_month.reset_index())
        # story.append(Paragraph("Matrix Details", styles['Heading2']))
        # story.append(Table(project_details_table_content, style=project_details_table_content_style))
        # story.append(Spacer(1, 20))

        # # Build PDF document
        # doc.build(story)
        # buffer.seek(0)


        # Register a custom font (optional)
        pdfmetrics.registerFont(TTFont('CustomFont',r'D:\bug_tracking_sajive_project\new_bug_tracking\bug_tracker_internal_project\Backend\pdf_report_generatot\dont.ttf'))  # Use your actual font path

        # Get styles
        styles = getSampleStyleSheet()

        # Modify the title_style to use a different font
        title_style = ParagraphStyle(name='Title', fontName='CustomFont', fontSize=18, alignment=1, spaceAfter=12)

        # Modify Heading2 style to use a different font
        heading_style = ParagraphStyle(name='Heading2', fontName='CustomFont', fontSize=14, spaceAfter=10)

        # Modify other styles if needed
        body_style = ParagraphStyle(name='BodyText', fontName='CustomFont', fontSize=12, spaceAfter=6)

        # Update your story with the new styles
        story = []

        story.append(Paragraph("Analytics Report", title_style))
        story.append(Spacer(1, 20))

        # Add project details
        project_details_table_content, project_details_table_content_style = create_table_content(project_details_table_pd.reset_index())
        story.append(Paragraph("Project Details", heading_style))
        story.append(Table(project_details_table_content, style=project_details_table_content_style))
        story.append(Spacer(1, 20))

        # Add monthly chart
        story.append(Paragraph("Monthly Metrics", heading_style))
        monthly_chart = create_plotly_chart_month(first_month, second_month, f"{data['month']} Metrics Trend", data["month"])
        story.append(Image(monthly_chart, width=500, height=300))
        story.append(Spacer(1, 20))

        # Add tester details tables
        for trash, trash2 in zip(collecion_test_details, test_excecution_status_name):
            monthly_data, monthly_style = create_table_content(trash.reset_index())
            story.append(Paragraph(f" {trash2} Test Details", heading_style))
            story.append(Table(monthly_data, style=monthly_style))
            story.append(Spacer(1, 30))

        # Matrix details
        # project_details_table_content, project_details_table_content_style = create_table_content(first_month.reset_index())
        # story.append(Paragraph("Matrix Details", heading_style))
        # story.append(Table(project_details_table_content, style=project_details_table_content_style))
        # story.append(Spacer(1, 20))

        # Build PDF document
        doc.build(story)
        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=False,  # Set this to False to display in the browser
            download_name='analytics_report.pdf',
            mimetype='application/pdf'
        )

