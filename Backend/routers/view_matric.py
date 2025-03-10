
from flask import jsonify, request
# from models import db,Users,Project_name,Project_details,Metrics
from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus,Metrics
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
import pandas as pd
import datetime
import datetime
from datetime import datetime
from functools import reduce
import calendar

def load_all_data_set(id):
    new_defaact_values = New_defects.query.filter_by(project_name_id=id).all()
    new_defaact_values = [trash.to_dict() for trash in new_defaact_values]
    test_execution_values = Test_execution_status.query.filter_by(project_name_id=id).all()
    test_execution_values = [trash.to_dict() for trash in test_execution_values]
    total_defact_values = Total_Defect_Status.query.filter_by(project_name_id=id).all()
    total_defact_values = [trash.to_dict() for trash in total_defact_values]
    build_status_values = BuildStatus.query.filter_by(project_name_id=id).all()
    build_status_values = [trash.to_dict() for trash in build_status_values]
    defact_accepted_rejected_values = DefectAcceptedRejected.query.filter_by(project_name_id=id).all()
    defact_accepted_rejected_values = [trash.to_dict() for trash in defact_accepted_rejected_values]
    test_case_creaction_values = TestCaseCreationStatus.query.filter_by(project_name_id=id).all()
    test_case_creaction_values = [trash.to_dict() for trash in test_case_creaction_values]
    #get the Dedact lead calculationi
    
    collection_variable = [new_defaact_values,test_execution_values,total_defact_values,build_status_values,defact_accepted_rejected_values,test_case_creaction_values]
    collction_dataframe = []
    for trash in collection_variable:
        df = pd.DataFrame(trash)
        df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
        df['Year'] = df['date'].dt.year
        df['Week'] = df['date'].dt.isocalendar().week
        df['Month'] = df['date'].dt.month
        collction_dataframe.append(df)
    
    new_defact = collction_dataframe[0].groupby(['Year', 'Month']).agg({'regression_defect': 'sum',"functional_defect":"sum","defect_reopened":"sum","uat_defect":"sum"}).reset_index()

    test_execution = collction_dataframe[1].groupby(['Year', 'Month']).agg({'total_execution': 'sum',"tc_execution":"sum","pass_count":"sum","fail_count":"sum","no_run":"sum","blocked":"sum"}).reset_index()

    total_defact = collction_dataframe[2].groupby(['Year', 'Month']).agg({'total_defect': 'sum',"defect_closed":"sum","open_defect":"sum","critical":"sum","high":"sum","medium":"sum","low":"sum"}).reset_index()

    build_status = collction_dataframe[3].groupby(['Year', 'Month']).agg({'total_build_received': 'sum',"builds_accepted":"sum","builds_rejected":"sum"}).reset_index()

    defact_accepted_rejected = collction_dataframe[4].groupby(['Year', 'Month']).agg({'total_defects': 'sum',"dev_team_accepted":"sum","dev_team_rejected":"sum"}).reset_index()

    test_case_creaction = collction_dataframe[5].groupby(['Year', 'Month']).agg({'total_test_case_created': 'sum',"test_case_approved":"sum","test_case_rejected":"sum"}).reset_index()


    collction_dataframe = [new_defact,test_execution,total_defact,build_status,defact_accepted_rejected,test_case_creaction]

    print(len(collction_dataframe))
    return collction_dataframe

    







def get_values_df(matrix_values):
    
    matrix_values = [trash.to_dict() for trash in matrix_values]
    df = pd.DataFrame(matrix_values)
    df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
    df['Year'] = df['date'].dt.year
    df['Week'] = df['date'].dt.isocalendar().week
    df['month'] = df['date'].dt.month

    weekly_report = df.groupby(['Year', 'month', 'Week']).agg({'defectleakage': 'sum',"defectdensity":"sum",
    "defectremovalefficiency":"sum",
    "automationcoverage":"sum",
    "testcasesefficiency":"sum",
    "testerproductivity":"sum",
    "defectseverityindex":"sum",
    "defectfixrate":"sum",
    "defectrejectionratio":"sum",
    "meantimetofinddefect":"sum",
    "meantimetorepair":"sum"}).reset_index()



    return weekly_report







def test_matric_routing(app):
    @app.route("/view_matrix_month/<int:id>", methods=["GET"])
    @jwt_required()
    def get_matrix_values(id):
        
        matrix_values = Metrics.query.filter_by(project_name_id=id).all()

        get_month_wise = get_values_df(matrix_values)
        # today = datetime.now().month
        month = datetime.now().month
        # print("here ",get_month_wise.iloc[0])

        month_filter = get_month_wise[get_month_wise["month"]  == month]
        # print()
        # month_filter = get_month_wise[[get_month_wise'month'] == month]
        print(month_filter)
        final_month_values = month_filter[[
    "defectleakage", 
    "defectdensity", 
    "defectremovalefficiency", 
    "automationcoverage", 
    "testcasesefficiency", 
    "testerproductivity", 
    "defectseverityindex", 
    "defectfixrate",
    "defectrejectionratio",
    "meantimetofinddefect", 
    "meantimetorepair"
]].sum()
        result_dict = final_month_values.to_dict()

    # Optionally, print the dictionary for debugging
        print(result_dict)


        return result_dict
    
    @app.route("/view_matrix_month_chart/<int:id>", methods=["post"])
    @jwt_required()
    def get_mertix_month_wise(id):

        
        data = request.json
        matrix_values = Metrics.query.filter_by(project_name_id=id).all()
        get_month_wise = get_values_df(matrix_values)
        today = datetime.now().month
        month = datetime.strptime(data["month"], '%B').month
        month_2= 0
        if month == 1:
            month_2 = 12    
        else:
            month_2 = month - 1  
        
        # print("here ",get_month_wise.iloc[0])
        first_month = get_month_wise[get_month_wise["month"]  == month]
        second_month = get_month_wise[get_month_wise["month"]  == month_2]

        print("first",first_month)
        print("second",second_month)
        # print()
        # month_filter = get_month_wise[[get_month_wise'month'] == month]
        print(first_month)
        print(second_month)
        first_month = first_month[[
    "defectleakage", 
    "defectdensity", 
    "defectremovalefficiency", 
    "automationcoverage", 
    "testcasesefficiency", 
    "testerproductivity", 
    "defectseverityindex", 
    "defectfixrate",
    "defectrejectionratio",
    "meantimetofinddefect", 
    "meantimetorepair"
                    ]].sum()
        second_month = second_month[[
    "defectleakage", 
    "defectdensity", 
    "defectremovalefficiency", 
    "automationcoverage", 
    "testcasesefficiency", 
    "testerproductivity", 
    "defectseverityindex", 
    "defectfixrate",
    "defectrejectionratio",
    "meantimetofinddefect", 
    "meantimetorepair"
                    ]].sum()
        
        result_dict = first_month.to_dict()
        result_dict2 = second_month.to_dict()

        



        # Optionally, print the dictionary for debugging
        print(result_dict)
        print(result_dict2)
        return {"first_month":result_dict,"second_month":result_dict2}
            
    
    @app.route("/view_matrix_week/<int:id>", methods=["post"])
    @jwt_required()
    def get_metrics_week_wise(id):
        data = request.json
        matrix_values = Metrics.query.filter_by(project_name_id=id).all()
        get_month_wise = get_values_df(matrix_values)
        today = datetime.now().month
        month = datetime.strptime(data["month"], '%B').month

        # Filter the rows where the month column matches the selected month
        first_month = get_month_wise[get_month_wise["month"] == month]


        # Convert each row in the filtered DataFrame to a dictionary
        result = [row.to_dict() for _, row in first_month.iterrows()]

        if result == []:
            return jsonify("No data found for the selected month.")

        print(result)
        return jsonify("weekly report", result)
    
    