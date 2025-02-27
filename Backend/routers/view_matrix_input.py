# from flask import jsonify, request
# from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus,Metrics
# from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
# import pandas as pd
# import datetime
# from datetime import datetime
# from functools import reduce
# from datetime import date
# from .billable_details_route import get_project_name

# from datetime import datetime



# def get_month():

#     date_obj = datetime.now()
#     return date_obj.strftime('%B')
  
        



# #------------------------------------------here calculate the value by using the formulas -------------------------

# #1 for get the Defect Leakage
# def defact_lead(values):
#     final_value = (values["uatDefect"])/(values["cpDefect"]+values["uatDefect"])*100
#     print(int(final_value))
#     return float(final_value)

# # 2 get the Defect Removal Effieceny

# def defect_density(values):
#     kloc = values["totalLinesOfCode"]//1000
#     final_value = values["cpDefects"]/kloc
#     return final_value


# # 3 Defect Removal Effieceny
# def defact_removal(values):
#     final_value = values["cpDefects"]/(values["cpDefects"]+values["uatDefects"])*100
#     return float(final_value)


# #for automaction total test case i am taking the Test Execution Status table of total tc exicuted

# """
#  'automationcoverage': ['totalAutomationTcExecuted', 'totalTestCases'],
#             'testcasesefficiency': ['defectsDetectedByTestCase', 'totalDefects'],
#             'testerproductivity': ['numberOfTestCasesExecuted', 'numberOfTesters'],

#             'defectseverityindex': ['critical', 'high', 'medium', 'low'],
            
#             'defectfixrate': ['defectFixed', 'defectReportedLevels'],
#             'defectrejectionratio': ['totalRejectedDefects', 'totalDefectsReported'],
#             'meantimetofinddefect': ['totalTimeToIdentifyDefects', 'totalNumberOfDefects'],
#             'meantimetorepair': ['totalTimeToFixDefects', 'totalDefectsFixed']



# """
# #4 automaction coverd

# def Automation_Coverage(values):
#     finale = values["totalAutomationTcExecuted"]/values["totalTestCases"]*100
#     return float(finale)




# # 5    testcase efficiency

# def test_case_efficiency(values):
#     final_value = values["defectsDetectedByTestCase"]/values["totalDefects"]*100
#     return final_value



# #calculate the Tester Productivity 
# # 6)

# def tester_productivity(values):
#     totaltestcase = values["numberOfTestCasesExecuted"]
#     testers = values["numberOfTesters"]
#     tester_benchmark = totaltestcase/testers
#     final = (totaltestcase/testers)*tester_benchmark
#     return float(final)


# # get defact_open()

# # 7)
# def Defect_Severity_Index(id):
#     # values = severity_index(id)
#     Levels = {"Critical":5,"High":4,"Medium":3,"low":1}
#     # total_values = sum(values.values())
#     total_values = sum(id.values())
#     final = (id["critical"]*Levels["Critical"])+(id["high"]*Levels["High"])+(id["medium"]*Levels["Medium"])+(id["low"]*Levels["low"])/total_values
#     return float(final)



# #Total Defect Status Defect(table) 
# # Fix rate 8)
# def Fix_rate(values):
#     final = values["defectFixed"]/values["defectReportedLevels"] * 100
#     print(final)
#     return float(final)



# #Defect Rejection Ratio
# # 9)
# def defact_rejection(id):
#     total_defact = id["totalRejectedDefects"]
#     total_defact_rejection = id["totalDefectsReported"]
#     final = total_defact_rejection/total_defact*100
#     return float(final)
    



# #10 mean time to find a defacts

# def mean_time_fina_defects(values):
#     final_value = values["totalTimeToIdentifyDefects"]/values["totalNumberOfDefects"]
#     return final_value


# # 11) mean time to repair

# def mean_time_to_repair(values):
#     final_value = values["totalTimeToFixDefects"]/values["totalDefectsFixed"]
#     return final_value












# def view_matrix_input_route(app):


#     @app.route("/create-matrix-inputs", methods=["POST"])
#     @jwt_required()
#     def view_matrix_input():
#         # Get the JSON data from the request
#         data = request.get_json()
#         project_name = data["project_name"]

#         user_id = get_jwt_identity()
#         # Log the data received for debugging
#         # print("Received data:", data)

#         # Optional: You can process the data (e.g., validate, save to database, etc.)
#         # For now, we'll just echo the received data.



#         # ------------------for check all the input are came are not ------------------------
        
        
        
        
#         # Example: Check if all required fields are present
#         required_fields = [
#             'month', 'date', 'project_name', 'defectleakage', 'defectdensity',
#             'defectremovalefficiency', 'automationcoverage', 'testcasesefficiency', 
#             'testerproductivity', 'defectseverityindex', 'defectfixrate', 
#             'defectrejectionratio', 'meantimetofinddefect', 'meantimetorepair'
#         ]
        
#         # Ensure the main fields are present
#         missing_fields = [field for field in required_fields if field not in data]
        
#         if missing_fields:
#             return jsonify({"error": "Missing required fields", "fields": missing_fields}), 400
    
#         # Ensure each sub-section (e.g., defectleakage, defectdensity) has valid values
#         sub_section_fields = {
#             'defectleakage': ['cpDefect', 'uatDefect', 'totalDefects'],
#             'defectdensity': ['cpDefects', 'totalLinesOfCode'],
#             'defectremovalefficiency': ['cpDefects', 'uatDefects'],
#             'automationcoverage': ['totalAutomationTcExecuted', 'totalTestCases'],
#             'testcasesefficiency': ['defectsDetectedByTestCase', 'totalDefects'],
#             'testerproductivity': ['numberOfTestCasesExecuted', 'numberOfTesters'],
#             'defectseverityindex': ['critical', 'high', 'medium', 'low'],
#             'defectfixrate': ['defectFixed', 'defectReportedLevels'],
#             'defectrejectionratio': ['totalRejectedDefects', 'totalDefectsReported'],
#             'meantimetofinddefect': ['totalTimeToIdentifyDefects', 'totalNumberOfDefects'],
#             'meantimetorepair': ['totalTimeToFixDefects', 'totalDefectsFixed']
#         }
    
#         # Loop over each section and check if all required sub-fields are present
#         for section, fields in sub_section_fields.items():
#             if section in data:
#                 missing_sub_fields = [field for field in fields if field not in data[section]]
#                 if missing_sub_fields:
#                     return jsonify({"error": f"Missing fields in {section}", "fields": missing_sub_fields}), 400
    

#         # ------------------for check all the input are came are not ------------------------


#         order_to_perform_function = [defact_lead,defect_density,defact_removal,Automation_Coverage,test_case_efficiency,tester_productivity,Defect_Severity_Index,Fix_rate,defact_rejection,mean_time_fina_defects,mean_time_to_repair]

    
#         test = request.get_json()
#         del test['month']
#         del test['date']
#         del test['project_name']

#         test = test.values()

#         for trash in test:
#             print(trash)

#         final_result = []

#         for trash1, trash2 in zip(order_to_perform_function,test):
#             final_result.append(trash1(trash2))

#         print(data)
        

#         try:
#             new_values = Metrics(month=get_month(),date=datetime.now(),defectleakage=final_result[0],defectdensity=final_result[1],defectremovalefficiency=final_result[2],automationcoverage=final_result[3],testcasesefficiency=final_result[4],testerproductivity=final_result[5],defectseverityindex=final_result[6],defectfixrate=final_result[7],defectrejectionratio=final_result[8],meantimetofinddefect=final_result[9],meantimetorepair=final_result[10],
#         project_name_id = get_project_name(project_name),
#         user_id = user_id)
#             db.session.add(new_values)
#             db.session.commit()
#         except:
#             db.session.rollback()
#             return jsonify("error on adding the data")
        

        
#         # Optional: If needed, validate or process the values, e.g., check for numeric fields, etc.
    
#         # Return the data as a response (for now)
#         return jsonify({"message": "Data received successfully", "data": data}), 200












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