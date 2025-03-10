
# -----code from chat0gtp-----------



from flask import jsonify, request, abort
from models import db, Users, Project_name, Project_details, New_defects, Total_Defect_Status, Test_execution_status, Testers, TestCaseCreationStatus, DefectAcceptedRejected, BuildStatus, Metrics
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import pandas as pd
from datetime import datetime
from .billable_details_route import get_project_name

# Helper function to get the current month
def get_month():
    return datetime.now().strftime('%B')

# 1. Defect Leakage
def defect_leakage(values):
    return float((values["uatDefect"]) / (values["cpDefect"] + values["uatDefect"]) * 100)

# 2. Defect Density
def defect_density(values):
    kloc = values["totalLinesOfCode"] // 1000
    return values["cpDefects"] / kloc

# 3. Defect Removal Efficiency
def defect_removal(values):
    return float(values["cpDefects"] / (values["cpDefects"] + values["uatDefects"]) * 100)

# 4. Automation Coverage
def automation_coverage(values):
    return float(values["totalAutomationTcExecuted"] / values["totalTestCases"] * 100)

# 5. Test Case Efficiency
def test_case_efficiency(values):
    return float(values["defectsDetectedByTestCase"] / values["totalDefects"] * 100)

# 6. Tester Productivity
def tester_productivity(values):
    return float((values["numberOfTestCasesExecuted"] / values["numberOfTesters"]) * (values["numberOfTestCasesExecuted"] / values["numberOfTesters"]))

# 7. Defect Severity Index
def defect_severity_index(values):
    Levels = {"Critical": 5, "High": 4, "Medium": 3, "low": 1}
    total_values = sum(values.values())
    return float((values["critical"] * Levels["Critical"]) + 
                 (values["high"] * Levels["High"]) + 
                 (values["medium"] * Levels["Medium"]) + 
                 (values["low"] * Levels["low"])) / total_values

# 8. Fix Rate
def fix_rate(values):
    return float(values["defectFixed"] / values["defectReportedLevels"] * 100)

# 9. Defect Rejection Ratio
def defect_rejection(values):
    return float(values["totalRejectedDefects"] / values["totalDefectsReported"] * 100)

# 10. Mean Time to Find Defects
def mean_time_to_find_defects(values):
    return values["totalTimeToIdentifyDefects"] / values["totalNumberOfDefects"]

# 11. Mean Time to Repair
def mean_time_to_repair(values):
    return values["totalTimeToFixDefects"] / values["totalDefectsFixed"]

# Route for matrix input
def view_matrix_input_route(app):
    @app.route("/create-matrix-inputs", methods=["POST"])
    @jwt_required()
    def view_matrix_input():
        # Get the JSON data from the request
        data = request.get_json()
        project_name = data.get("project_name")
        user_id = get_jwt_identity()

        # Define required fields
        required_fields = [
            'month', 'date', 'project_name', 'defectleakage', 'defectdensity', 'defectremovalefficiency',
            'automationcoverage', 'testcasesefficiency', 'testerproductivity', 'defectseverityindex',
            'defectfixrate', 'defectrejectionratio', 'meantimetofinddefect', 'meantimetorepair'
        ]

        # Check for missing fields
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            abort(400, description=f"Missing required fields: {', '.join(missing_fields)}")

        # Sub-section fields validation
        sub_section_fields = {
            'defectleakage': ['cpDefect', 'uatDefect'],
            'defectdensity': ['cpDefects', 'totalLinesOfCode'],
            'defectremovalefficiency': ['cpDefects', 'uatDefects'],
            'automationcoverage': ['totalAutomationTcExecuted', 'totalTestCases'],
            'testcasesefficiency': ['defectsDetectedByTestCase', 'totalDefects'],
            'testerproductivity': ['numberOfTestCasesExecuted', 'numberOfTesters'],
            'defectseverityindex': ['critical', 'high', 'medium', 'low'],
            'defectfixrate': ['defectFixed', 'defectReportedLevels'],
            'defectrejectionratio': ['totalRejectedDefects', 'totalDefectsReported'],
            'meantimetofinddefect': ['totalTimeToIdentifyDefects', 'totalNumberOfDefects'],
            'meantimetorepair': ['totalTimeToFixDefects', 'totalDefectsFixed']
        }

        for section, fields in sub_section_fields.items():
            if section in data:
                missing_sub_fields = [field for field in fields if field not in data[section]]
                if missing_sub_fields:
                    abort(400, description=f"Missing fields in {section}: {', '.join(missing_sub_fields)}")

        # Order of functions to apply
        order_to_perform_function = [
            defect_leakage, defect_density, defect_removal, automation_coverage, test_case_efficiency,
            tester_productivity, defect_severity_index, fix_rate, defect_rejection, mean_time_to_find_defects, mean_time_to_repair
        ]

        # Prepare the data to pass to the functions
        test_data = [data[field] for field in required_fields[3:]]

        # Calculate final results
        final_result = [func(test) for func, test in zip(order_to_perform_function, test_data)]

        print(get_project_name(project_name))

        # Save the calculated values to the database
        try:
            new_values = Metrics(
                month=get_month(),
                date=datetime.today(),
                defectleakage=final_result[0],
                defectdensity=final_result[1],
                defectremovalefficiency=final_result[2],
                automationcoverage=final_result[3],
                testcasesefficiency=final_result[4],
                testerproductivity=final_result[5],
                defectseverityindex=final_result[6],
                defectfixrate=final_result[7],
                defectrejectionratio=final_result[8],
                meantimetofinddefect=final_result[9],
                meantimetorepair=final_result[10],
                project_name_id=get_project_name(project_name).id,
                user_id=user_id
            )
            db.session.add(new_values)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, description="Error adding data to the database: " + str(e))

        # Return success message
        return jsonify({"message": "Data received and processed successfully", "data": data}), 200


    # ---------------------for delete the request ----------------------------------
    @app.route("/delete-matrix-inputs/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_matrix_input(id):
        # Get the current user identity
        user_id = get_jwt_identity()

        # Query the database for the record to delete
        matrix_data = Metrics.query.filter_by(id=id).first()

        if not matrix_data:
            abort(404, description="Matrix data not found for the given ID or you don't have permission to delete it")

        # Delete the matrix record
        try:
            db.session.delete(matrix_data)
            db.session.commit()
            return jsonify({"message": "Matrix data deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            abort(500, description="Error deleting data: " + str(e))


    @app.route("/get-matrix-inputs/<int:id>", methods=["GET"])
    @jwt_required()
    def get_matrix_input(id):
        # Get query parameters
        # project_name = request.args.get('project_name')
        # month = request.args.get('month')
        
        # Fetch the project ID based on project name
        # project_name_id = get_project_name(project_name)
#
        # Query the database for the matching records
        matrix_data = Metrics.query.filter_by(project_name_id=id).all()
        
        if not matrix_data:
            return jsonify({"message":"Matrix data not found for the given project name and month"}),403

        # Return the matrix data as a JSON response
        matrix_data = [trash.to_dict() for trash in matrix_data]
        return jsonify(matrix_data),200