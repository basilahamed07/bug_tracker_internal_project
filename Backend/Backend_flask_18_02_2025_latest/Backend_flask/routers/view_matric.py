# from flask import jsonify, request
# from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus
# from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
# import pandas as pd
# import datetime
# from datetime import datetime
# from functools import reduce



# def tester_count(id):
#     values = Testers.query.filter_by(project_name_id=id).all()
#     return len(values)


# def get_defact_open(id):
#     values = Total_Defect_Status.query.filter_by(project_name_id=id).all()
#     values = values[-1]
#     values_closed = values.defect_closed
#     values_open = values.open_defect
    
#     return (values_closed,values_open)


# def total_rejection(id):
#     total_rejection_value = DefectAcceptedRejected.query.filter_by(project_name_id=id).all()
#     values = total_rejection_value[-1]
#     total_rejection_values = values.dev_team_rejected
#     return total_rejection_values

# def severity_index(id):
#     severity = Total_Defect_Status.query.filter_by(project_name_id=id).all()
#     severity = severity[-1]
#     Critical = severity.critical
#     high = severity.high
#     medium = severity.medium
#     low = severity.low
#     return {"cr":Critical,"hi":high,"me":medium,"low":low}

# #get the automaction tc valeu

# def automaction_tc(id):
#     value = Test_execution_status.query.filter_by(project_name_id=id).all()
#     (value)
#     valuee = value[-1]
#     values = valuee.tc_execution
#     return values


# #get total test case exicuction

# def total_tc(id):
#     value = Test_execution_status.query.filter_by(project_name_id=id).all()
#     value = value[-1]
#     value = value.total_execution
#     return value


# #get uat defact_valifue
# def uat_value_function(id):
#     values = New_defects.query.filter_by(project_name_id=id).all()
#     values = values[-1]
#     uat_value = values.uat_defect
#     return uat_value

# #get the cp defact value

# def cp_total_defact(id):
#     cp_testcase = DefectAcceptedRejected.query.filter_by(project_name_id=id).all()
#     values = cp_testcase[-1]
#     cp_total_value = values.total_defects
#     return cp_total_value











# #------------------------------------------here calculate the value by using the formulas -------------------------

# #for get the Defect Leakage
# def defact_lead(id):
#     print("here is the tyep :",type(id))
#     uat_value = id["uat_defect_x"]
#     cp_total_value = id["total_defect"]
#     final_value = uat_value/(cp_total_value+uat_value)*100
#     print(int(final_value))
#     return float(final_value)

# # get the Defect Removal Effieceny

# def defact_removal(id):
#     uat_value = id["uat_defect_x"]
#     cp_total_value = id["total_defect"]
#     final_value = cp_total_value/(cp_total_value+uat_value)*100
#     return float(final_value)


# #for automaction total test case i am taking the Test Execution Status table of total tc exicuted

# def Automation_Coverage(id):
#     finale = id["tc_execution"]/id["total_execution"]*100
#     return float(finale)

# #calculate the Tester Productivity 6)

# def tester_productivity(id,project_id):
#     totaltestcase = id["total_execution"]
#     testers = tester_count(id=project_id)
#     tester_benchmark = totaltestcase/testers
#     final = (totaltestcase/testers)*tester_benchmark
#     return float(final)


# # get defact_open()




# #Total Defect Status Defect(table) Fix rate 7)
# def Fix_rate(id):
#     final = id["defect_closed"]/id["open_defect"] * 100
#     print(final)
#     return float(final)



# #Defect Rejection Ratio

# def defact_rejection(id):
#     total_defact = id["total_defects"]
#     total_defact_rejection = id["dev_team_rejected"]
#     final = total_defact_rejection/total_defact*100
#     return float(final)
    



# def Defect_Severity_Index(id):
#     # values = severity_index(id)
#     Levels = {"Critical":5,"High":4,"Medium":3,"low":1}
#     # total_values = sum(values.values())
#     total_values = id[['critical', 'high', 'medium', 'low']].sum(axis=1)
#     final = (id["critical"]*Levels["Critical"])+(id["high"]*Levels["High"])+(id["medium"]*Levels["Medium"])+(id["low"]*Levels["low"])/total_values
#     return float(final)

# # ---------------------------------------------------------to calculate the chart things --------------------------








# def test_matric_routing(app):


#     @app.route("/view_matric_calculation/<int:id>", methods=["GET"])
#     @jwt_required()
#     def view_matric_calculation(id):

#         # get the values by using the pandas:
        
#         # print(collction_dataframe)
#         data_frames = load_all_data_set(id)  # This should return a list of 6 DataFrames

# # Initialize the merged DataFrame with the first DataFrame in the list
#         final_df = data_frames[0]
#         for trash in data_frames:
#             final_df = pd.merge(final_df, trash, on=['Year', 'Month'])

#         month = datetime.today().month
#         # month =  12
#         print(month)

#         filter_df = final_df[final_df['Month'] == month]


#         if filter_df.empty:
#             return jsonify({"message":"this month not found"})
#         else:
#             print(final_df.iloc[0])
#             defact_leakage = defact_lead(filter_df)
#             print(defact_leakage)
#             defact_removal_value = defact_removal(filter_df)
#             Automation_Coverage_value = Automation_Coverage(filter_df)

#             #bending for clarification

#             tester_productivity_value = tester_productivity(filter_df,id)
#             Fix_rate_values = Fix_rate(filter_df)
#             defact_rejection_values = defact_rejection(filter_df)
#             Defect_Severity_Index_values = Defect_Severity_Index(filter_df)



#         return jsonify({"defact_lead_value":defact_leakage,
#                         "defact_removal_value":defact_removal_value,
#                         "Automation_Coverage_value":Automation_Coverage_value,
#                         "tester_productivity_value":tester_productivity_value,
#                         "Fix_rate_values":Fix_rate_values,
#                         "defact_rejection_values":defact_rejection_values, "Defect_Severity_Index_values":Defect_Severity_Index_values})



#     @app.route("/view_matrix_week/<int:id>", methods=["GET"])
#     @jwt_required()
#     def view_matric_chart(id):
#         #to get the defact severty values
#         Defect_Severity = values_fordefact_severity(id)
#         print(Defect_Severity)
#         # print(Defect_Severity)
#         # print(Defect_Severity)
#         # print(Defect_Severity)

#         # insert the tester count in that
#         Defect_Severity["tester_count"] = Defect_Severity.apply(tester_count_chart,axis=1)
        
        
        
#         # print(Defect_Severity)
#         #
#         get_defact_open_df = get_defact_open_chart(Defect_Severity) #completed

#         # merged_one_two = pd.merge(Defect_Severity, get_defact_open_df, on=['Year', 'Month', 'Week'], how='inner')

#         automaction_tc_get = automaction_tc_chart(Defect_Severity) # completed

#         # merged_two_three = pd.merge(merged_one_two, automaction_tc_get, on=['Year', 'Month', 'Week'], how='inner')
        
#         get_new_defact = uat_value_function_chart(Defect_Severity) # completed


#         cp_total_defact_values = cp_total_defact_chart(Defect_Severity) # completed

#         dfs = [Defect_Severity, get_defact_open_df, automaction_tc_get, get_new_defact, cp_total_defact_values]

#         final_merge = reduce(lambda left, right: pd.merge(left, right, on=['Year', 'Month', 'Week'], how='inner'), dfs)

#         # print(final_merge.iloc[0])

#         # for calculate the final values by using the pandas
#         #for calculte the formula for specific colums
#         final_merge["Defect_Severity_chart"] = final_merge.apply(Defect_Severity_chart,axis=1)
#         print(final_merge["Defect_Severity_chart"])

#         final_merge["Defect_Lead_Chart"] = final_merge.apply(defact_lead_charts, axis=1)

#         # Apply the defect_removal_charts function
#         final_merge["Defect_Removal_Chart"] = final_merge.apply(defact_removal_charts, axis=1)

#         # Apply the Automation_Coverage_charts function
#         final_merge["Automation_Coverage_Chart"] = final_merge.apply(Automation_Coverage_charts, axis=1)

#         # Apply the tester_productivity_charts function
#         final_merge["Tester_Productivity_Chart"] = final_merge.apply(tester_productivity_charts, axis=1)

#         # Apply the Fix_rate_charts function
#         final_merge["Fix_Rate_Chart"] = final_merge.apply(Fix_rate_charts, axis=1)

#         # Apply the defact_rejection_charts function
#         final_merge["Defact_Rejection_Chart"] = final_merge.apply(defact_rejection_charts, axis=1)
#         # print(final_merge.iloc[2])

#         # print(Defect_Severity)

#         print(final_merge.iloc[0])
#         final = final_merge.to_dict(orient='records')

#         # print(final)

#         check = final_merge.isnull().values.any()

#         print(check)

#         if not check:
#             return jsonify(final)
#         else:
#             return jsonify({"message": "No data found"})
        
#     @app.route("/view_matric_calculation/<int:id>", methods=["POST"])
#     @jwt_required()
#     def view_matric_calculation_month(id):

#         # get the values by using the pandas:
#         if request.method == "POST":
#             data = request.json["date"]

        
#         # print(collction_dataframe)
#         data_frames = load_all_data_set(id)  # This should return a list of 6 DataFrames

# # Initialize the merged DataFrame with the first DataFrame in the list
#         final_df = data_frames[0]
#         for trash in data_frames:
#             final_df = pd.merge(final_df, trash, on=['Year', 'Month'])

#         # month = datetime.today().month
#         month =  12
#         print(month)

#         filter_df = final_df[final_df['Month'] == month]


#         if filter_df.empty:
#             return jsonify({"message":"this month not found"})
#         else:
#             print(final_df.iloc[0])
#             defact_leakage = defact_lead(filter_df)
#             print(defact_leakage)
#             defact_removal_value = defact_removal(filter_df)
#             Automation_Coverage_value = Automation_Coverage(filter_df)

#             #bending for clarification

#             tester_productivity_value = tester_productivity(filter_df,id)
#             Fix_rate_values = Fix_rate(filter_df)
#             defact_rejection_values = defact_rejection(filter_df)
#             Defect_Severity_Index_values = Defect_Severity_Index(filter_df)



#         return jsonify({"defact_lead_value":defact_leakage,
#                         "defact_removal_value":defact_removal_value,
#                         "Automation_Coverage_value":Automation_Coverage_value,
#                         "tester_productiRvity_value":tester_productivity_value,
#                         "Fix_rate_values":Fix_rate_values,
#                         "defact_rejection_values":defact_rejection_values, "Defect_Severity_Index_values":Defect_Severity_Index_values})



# # first get the value from database and convert it and fi   lter the data
# def values_fordefact_severity(id): #completed
#     # get the data from the database
#     testvaleu  = Total_Defect_Status.query.filter_by(project_name_id=id).all()
#     values = Testers.query.filter_by(project_name_id=id).all()
#     final = [trash.to_dict() for trash in testvaleu]
#     #      #load into the frame
#     df = pd.DataFrame(final)
#     # print(df)
#     # Convert 'Date' to datetime format
#     df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
#     df['Year'] = df['date'].dt.year
#     df['Week'] = df['date'].dt.isocalendar().week
#     df['Month'] = df['date'].dt.month
#     weekly_summary = df.groupby(['Year', 'Month', 'Week']).agg({'total_defect': 'sum'
#                                                                 ,"critical":"sum",
#                                                                 "high":"sum",
#                                                                 "medium":"sum",
#                                                                 "low":"sum"}).reset_index()
    
#     # month  = datetime.today().month
#     month = 12
#     month_report = weekly_summary[weekly_summary['Month'] == month]
#     # total_value
#     colum_to_sum = ["critical","high","medium","low"]
#     month_report["total_value"] = month_report[colum_to_sum].sum(axis=1)
#     month_report["project_name_id"] = df["project_name_id"]

#     return month_report

# # get the tester count
# def tester_count_chart(row):
#     values = Testers.query.filter_by(project_name_id=int(row["project_name_id"])).all()
#     return len(values)



# #completed
# def get_defact_open_chart(row):
#     row = (row.iloc[0])
#     values = Total_Defect_Status.query.filter_by(project_name_id=int(row["project_name_id"])).all()
#     # print("test status",values)
#     df = [trash.to_dict() for trash in values]
#     df = pd.DataFrame(df)
#     # print(df)
#     df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
#     df['Year'] = df['date'].dt.year
#     df['Week'] = df['date'].dt.isocalendar().week
#     df['Month'] = df['date'].dt.month

#     weekly_report = df.groupby(['Year', 'Month', 'Week']).agg({'defect_closed': 'sum'
#                                                                 ,"open_defect":"sum",
#                                                                 }).reset_index()
#     # print(weekly_report)
#     # month  = datetime.today().month
#     month = 12
#     month_report = weekly_report[weekly_report['Month'] == month]
#     # total_value
    
#     return month_report





# # finished Defect_Severity_Index_values
# def Defect_Severity_chart(row):
#     values = row
#     Levels = {"Critical":5,"High":4,"Medium":3,"low":1}
#     # total_values = sum(values.values())
#     final = (values["critical"]*Levels["Critical"])+(values["high"]*Levels["High"])+(values["medium"]*Levels["Medium"])+(values["low"]*Levels["low"])/values["total_value"]
#     print(f" thsi was the fineal report {final}")
#     return int(final) #floafinal



# # Automation_Coverage_value			
# def Automation_Coverage_chart(row):
#     finale = row["automaction"]/row["total_testcase"]*100
#     return finale                   					


# def automaction_tc_chart(row):
#     print(row)
#     row  = row.iloc[0]
#     value = Test_execution_status.query.filter_by(project_name_id=int(row["project_name_id"])).all()
#     # print("test status",value)
#     df = [trash.to_dict() for trash in value]
    
#     df = pd.DataFrame(df)
#     # print(df)
#     # print(df)
#     df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
#     df['Year'] = df['date'].dt.year
#     df['Week'] = df['date'].dt.isocalendar().week
#     df['Month'] = df['date'].dt.month

#     weekly_report = df.groupby(['Year', 'Month', 'Week']).agg({'tc_execution': 'sum',
#                                                                "total_execution":"sum"
#                                                                 }).reset_index()
#     # month  = datetime.today().month
#     month = 12
#     month_report = weekly_report[weekly_report['Month'] == month]
#     # total_value
    
#     # print(weekly_report)
    
#     return month_report

# # referance


# def uat_value_function_chart(row):
#     row  = row.iloc[0]
#     values = New_defects.query.filter_by(project_name_id=int(row["project_name_id"])).all()
#     df = [trash.to_dict() for trash in values]
#     df = pd.DataFrame(df)
#     df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
#     df['Year'] = df['date'].dt.year
#     df['Week'] = df['date'].dt.isocalendar().week
#     df['Month'] = df['date'].dt.month

#     weekly_report = df.groupby(['Year', 'Month', 'Week']).agg({'uat_defect': 'sum'
#                                                                 }).reset_index()
#     # month  = datetime.today().month
#     month = 12
#     month_report = weekly_report[weekly_report['Month'] == month]
#     return month_report

# def cp_total_defact_chart(row):
#     row  = row.iloc[0]
#     values = DefectAcceptedRejected.query.filter_by(project_name_id=int(row["project_name_id"])).all()
#     df = [trash.to_dict() for trash in values]
#     df = pd.DataFrame(df)
#     df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
#     df['Year'] = df['date'].dt.year
#     df['Week'] = df['date'].dt.isocalendar().week
#     df['Month'] = df['date'].dt.month

#     weekly_report = df.groupby(['Year', 'Month', 'Week']).agg({'total_defects': 'sum',"dev_team_rejected":"sum"
#                                                                 }).reset_index()
#     # month  = datetime.today().month
#     month = 12
#     month_report = weekly_report[weekly_report['Month'] == month]
#     return month_report



# #fomula for calculate the row for charts


# #------------------------------------------here calculate the value by using the formulas -------------------------



# #for get the Defect Leakage
# def defact_lead_charts(row):
#     uat_value = row["uat_defect"]
#     cp_total_value = row["total_defects"]
#     final_value = uat_value/(cp_total_value+uat_value)*100
#     return final_value

# # get the Defect Removal Effieceny

# def defact_removal_charts(row):
#     uat_value = row["uat_defect"]
#     cp_total_value = row["total_defects"]
#     final_value = cp_total_value/(cp_total_value+uat_value)*100
#     return final_value


# #for automaction total test case i am taking the Test Execution Status table of total tc exicuted

# def Automation_Coverage_charts(row):
#     finale = row["tc_execution"]/row["total_execution"]*100
#     return finale

# #calculate the Tester Productivity 6)

# def tester_productivity_charts(row):
#     totaltestcase = row["total_execution"]
#     testers = row["tester_count"]
#     tester_benchmark = totaltestcase/testers
#     final = (totaltestcase/testers)*tester_benchmark
#     return final


# # get defact_open()




# #Total Defect Status Defect(table) Fix rate 7)
# def Fix_rate_charts(row):
#     final = row["defect_closed"]/row["open_defect"] * 100
#     return final



# #Defect Rejection Ratio

# def defact_rejection_charts(row):
#     total_defact = row["total_defects"]
#     total_defact_rejection = row["dev_team_rejected"]
#     final = total_defact_rejection/total_defact*100
#     return final
    





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
    
    