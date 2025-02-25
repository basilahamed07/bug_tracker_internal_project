# updated code 
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
import os
from datetime import date
import pandas as pd


#get the month from the database

def get_mon_database(collection,id):
    useres = Users.query.filter_by(id=id).first()
    role = useres.role
    admin = False
    if role == "admin":
        admin = True
    
    month = []
    for trash in collection:
        if not role:
            print("user_inside")
            temp_variable = trash.query.filter_by(user_id=id).all()
            for trash1 in temp_variable:
                month+=[trash1.month]
        else:
            print("admin inside")
            temp_variable = trash.query.all()
            for trash1 in temp_variable:
                month+=[trash1.month]

    return list(set(month))


def get_mon_full_details(collection,id):
    month = []
    for trash in collection:
        temp_variable = trash.query.filter_by(project_name_id=id).all()
        for trash1 in temp_variable:
            month+=[trash1.month]
    return list(set(month))


#GET THE DETAILS OF THE TESTCASE BASED ON THE MONTH

def get_details_month(collection,month,user_id,project_id):
    result = []
    print(month,user_id,project_id)
    users = Users.query.filter_by(id=user_id).first()
    role = users.role
    users = False
    if role == "admin":
        users = True
    print(users)

    for trash in collection:
        for trash1 in month:
            if not users:
                print("user_here")
                temp_variable = trash.query.filter_by(user_id=user_id,project_name_id=project_id, month=trash1).order_by(trash.date.desc()).first()
                print(temp_variable)
                if temp_variable is None:
                    continue
                else:
                    result += [temp_variable.to_dict()]
            else:
                print("admin inside")
                temp_variable = trash.query.filter_by(project_name_id=project_id, month=trash1).order_by(trash.date.desc()).first()
                print(temp_variable)
                if temp_variable is None:
                    continue
                else:
                    result += [temp_variable.to_dict()]

    return result


#to store the variable name as the key words
def get_var_name(var):
    for name, value in globals().items():
        if value is var:
            return name


#logic for get assign the month recoding to the date


#for get the project id for corrosponding project name
def get_project_name(project_name):
    project = Project_name.query.filter_by(project_name=project_name).first()
    return project



# convert the date into month
def get_month(date_str):
    if len(date_str) >= 9:
        date_obj = date.fromisoformat(date_str[0:10])
        return date_obj.strftime('%B')
    else:
        date_obj = date.now()
        return date_obj.strftime('%B')



def test_details_route(app):

    @app.route("/get-user-projects", methods=["GET"])
    @jwt_required()
    def get_user_projects():
        user_id = get_jwt_identity()  # Get the user ID from the JWT token
        
        # Fetch the full user object from the database using the user ID
        user = Users.query.get(user_id)  # Assuming you have a Users model with a 'role' field
        
        if user is None:
            return jsonify({"error": "User not found"}), 404
        
        user_role = user.role  # Now you can safely access the 'role' attribute of the user

        if user_role == 'admin':
            # If user is an admin, return all projects
            projects = Project_name.query.all()
        else:
            # If user is not an admin, return only the projects associated with the user
            projects = Project_name.query.filter_by(user_id=user_id).all()

        # Return the projects as a JSON response
        return jsonify({
            "user_role" : user_role,
            "projects": [project.to_dict() for project in projects]}), 200
    

                         #_________for form 1 in bugs table________

    @app.route('/new_defects', methods=['GET', 'POST'])
    @jwt_required()
    def manage_defects():   
        if request.method == 'GET':
            #get only last three month recored
            # Handle GET request: Fetch all defects


            user_id = int(get_jwt_identity())
            defects = New_defects.query.all()
            print(defects)
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([New_defects],month,user_id)

            return jsonify(result)

            
            # return jsonify([defect.to_dict() for defect in defects])

        elif request.method == 'POST':
            # Handle POST request: Create a new defect
            data = request.json

            # Required fields for POST request
            required_fields = ['date', 'regression_defect', 'functional_defect', 'defect_reopened', 'uat_defect','project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400


            #for date convenstion
            date_in_month = get_month(data['date'])
            project_id = get_project_name(data['project_name_id']).id

            # Create new defect from the provided data
            new_defect = New_defects(
                date=data['date'],
                month=date_in_month,
                regression_defect=data['regression_defect'],
                functional_defect=data['functional_defect'],
                defect_reopened=data['defect_reopened'],
                uat_defect=data['uat_defect'],
                project_name_id=project_id,
                user_id=int(get_jwt_identity())
            )

            # Add the new defect to the database
            db.session.add(new_defect)
            db.session.commit()

            return jsonify(new_defect.to_dict()), 201  # Return created defect with a 201 status
    

    #get specific project testcase
    @app.route('/new_defects/<int:id>', methods=['GET'])
    @jwt_required()
    def manage_defact_get(id):   
        if request.method == 'GET':
            #get only last three month recored
            # Handle GET request: Fetch all defects


            user_id = int(get_jwt_identity())
            defects = New_defects.query.all()
            print(defects)
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([New_defects],month,user_id,project_id=id)

            return jsonify(result)

    # API endpoint to handle PUT and DELETE for '/new_defects/<int:id>'
    @app.route('/new_defects/<int:id>', methods=['PUT', 'DELETE'])
    @jwt_required()
    def update_or_delete_new_defect(id):
        # Get the defect by ID
        defect = New_defects.query.get_or_404(id)

        if request.method == 'PUT':
            # If the method is PUT, update the defect
            data = request.json

            # Required fields for PUT request
            required_fields = ['date', 'regression_defect', 'functional_defect', 'defect_reopened', 'uat_defect',     'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
                
            date_in_month = get_month(data['date'])
            # project_id = get_project_name(data['project_name_id']).id

            # Update the defect fields
            defect.date = data['date']
            defect.month = date_in_month
            defect.regression_defect = data['regression_defect']
            defect.functional_defect = data['functional_defect']
            defect.defect_reopened = data['defect_reopened']
            defect.uat_defect = data['uat_defect']
            defect.project_name_id = data['project_name_id']
            defect.user_id = int(get_jwt_identity())

            # Commit changes to the database
            db.session.commit()
            return jsonify(defect.to_dict())

        elif request.method == 'DELETE':
            # If the method is DELETE, remove the defect
            db.session.delete(defect)
            db.session.commit()
            return '', 204  # Return an empty response after successful deletion




    #get specific project testcase
    @app.route('/test_execution_status/<int:id>', methods=['GET'])
    @jwt_required()
    def manage_test_case_statuss(id):   
        if request.method == 'GET':
            #get only last three month recored
            # Handle GET request: Fetch all defects


            user_id = int(get_jwt_identity())
            defects = Test_execution_status.query.all()
            print(defects)
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([Test_execution_status],month,user_id,project_id=id)

            return jsonify(result)
    


                    #_________for form 2 in bugs table________

    @app.route('/test_execution_status', methods=['GET', 'POST'])
    @jwt_required()
    def manage_test_execution_status():
        if request.method == 'GET':
            # Handle GET request: Fetch all test execution statuses
            user_id = int(get_jwt_identity())
            defects = Test_execution_status.query.all()
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([Test_execution_status],month,user_id)

            return jsonify(result)


        elif request.method == 'POST':
            # Handle POST request: Create a new test execution status
            data = request.json

            # Required fields for POST request
            required_fields = [ 'date', 'total_execution', 'tc_execution', 'pass_count', 'fail_count', 'no_run',   'blocked', 'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
                
            date_in_month = get_month(data['date'])
            project_id = get_project_name(data['project_name_id']).id

            # Create new test execution status from the provided data
            new_status = Test_execution_status(
                month=date_in_month,
                date=data['date'],
                total_execution=data['total_execution'],
                tc_execution=data['tc_execution'],
                pass_count=data['pass_count'],
                fail_count=data['fail_count'],
                no_run=data['no_run'],
                blocked=data['blocked'],
                project_name_id=project_id,
                user_id=int(get_jwt_identity())
            )

            # Add the new status to the database
            db.session.add(new_status)
            db.session.commit()

            return jsonify(new_status.to_dict()), 201  # Return created status with a 201 status

    # API endpoint to handle PUT and DELETE for '/test_execution_status/<int:id>'
    @app.route('/test_execution_status/<int:id>', methods=['PUT', 'DELETE'])
    @jwt_required()
    def update_or_delete_test_execution_status(id):
        # Get the status by ID
        status = Test_execution_status.query.get_or_404(id)

        if request.method == 'PUT':
            # If the method is PUT, update the test execution status
            data = request.json

            # Required fields for PUT request
            required_fields = [ 'date', 'total_execution', 'tc_execution', 'pass_count', 'fail_count', 'no_run',   'blocked', 'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
            
            date_in_month = get_month(data['date'])
            # project_id = get_project_name(data['project_name_id']).id

            # Update the status fields
            status.month = date_in_month
            status.date = data['date']
            status.total_execution = data['total_execution']
            status.tc_execution = data['tc_execution']
            status.pass_count = data['pass_count']
            status.fail_count = data['fail_count']
            status.no_run = data['no_run']
            status.blocked = data['blocked']
            status.project_name_id = data['project_name_id']
            status.user_id = int(get_jwt_identity())

            # Commit changes to the database
            db.session.commit()
            return jsonify(status.to_dict())

        elif request.method == 'DELETE':
            # If the method is DELETE, remove the status
            db.session.delete(status)
            db.session.commit()
            return '', 204  # Return an empty response after successful deletion
        

                    #_________for form 3 in bugs table________

    #get specific project testcase
    @app.route('/total_defect_status/<int:id>', methods=['GET'])
    @jwt_required()
    def manage_total_defect_status_get(id):   
        if request.method == 'GET':
            #get only last three month recored
            # Handle GET request: Fetch all defects


            user_id = int(get_jwt_identity())
            defects = Total_Defect_Status.query.all()
            print(defects)
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([Total_Defect_Status],month,user_id,project_id=id)

            return jsonify(result)
        
    @app.route('/total_defect_status', methods=['GET', 'POST'])
    @jwt_required()
    def manage_total_defect_status():
        if request.method == 'GET':
            # Handle GET request: Fetch all total defect statuses
            # Handle GET request: Fetch all test execution statuses
            user_id = int(get_jwt_identity())
            defects = Total_Defect_Status.query.all()
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([Total_Defect_Status],month,user_id)


            return jsonify(result)


        elif request.method == 'POST':
            # Handle POST request: Create a new total defect status
            data = request.json

            # Required fields for POST request
            required_fields = [ 'date', 'total_defect', 'defect_closed', 'open_defect', 'critical', 'high',    'medium', 'low', 'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
                
            date_in_month = get_month(data['date'])
            project_id = get_project_name(data['project_name_id']).id

            # Create new total defect status from the provided data
            new_defect_status = Total_Defect_Status(
                month=date_in_month,
                date=data['date'],
                total_defect=data['total_defect'],
                defect_closed=data['defect_closed'],
                open_defect=data['open_defect'],
                critical=data['critical'],
                high=data['high'],
                medium=data['medium'],
                low=data['low'],
                project_name_id=project_id,
                user_id=int(get_jwt_identity())
            )

            # Add the new defect status to the database
            db.session.add(new_defect_status)
            db.session.commit()

            return jsonify(new_defect_status.to_dict()), 201  # Return created status with a 201 status

    # API endpoint to handle PUT and DELETE for '/total_defect_status/<int:id>'
    @app.route('/total_defect_status/<int:id>', methods=['PUT', 'DELETE'])
    @jwt_required()
    def update_or_delete_total_defect_status(id):
        # Get the status by ID
        defect_status = Total_Defect_Status.query.get_or_404(id)

        if request.method == 'PUT':
            # If the method is PUT, update the total defect status
            data = request.json
            print(data)

            # Required fields for PUT request
            required_fields = [ 'date', 'total_defect', 'defect_closed', 'open_defect', 'critical', 'high',    'medium', 'low', 'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
                
            date_in_month = get_month(data['date'])
            # project_id = get_project_name(data['project_name_id']).id

            # Update the defect status fields
            defect_status.month = date_in_month
            defect_status.date = data['date']
            defect_status.total_defect = data['total_defect']
            defect_status.defect_closed = data['defect_closed']
            defect_status.open_defect = data['open_defect']
            defect_status.critical = data['critical']
            defect_status.high = data['high']
            defect_status.medium = data['medium']
            defect_status.low = data['low']
            defect_status.project_name_id = int(data["project_name_id"])
            defect_status.user_id = int(get_jwt_identity())

            # Commit changes to the database
            db.session.commit()
            return jsonify(defect_status.to_dict())

        elif request.method == 'DELETE':
            # If the method is DELETE, remove the defect status
            db.session.delete(defect_status)
            db.session.commit()
            return '', 204  # Return an empty response after successful deletion
        

                    #_________for form 4 in bugs table________

    @app.route('/build_status', methods=['GET', 'POST'])
    @jwt_required()
    def manage_build_status():
        if request.method == 'GET':
            # Handle GET request: Fetch all build statuses
            user_id = int(get_jwt_identity())
            build_statuses = BuildStatus.query.all()
            month = get_mon_database(build_statuses,user_id)
            print(month)

            result = get_details_month([BuildStatus],month,user_id)

            return jsonify(result)


        elif request.method == 'POST':
            # Handle POST request: Create a new build status
            data = request.json

            # Required fields for POST request
            required_fields = [ 'date', 'total_build_received', 'builds_accepted', 'builds_rejected',   'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            date_in_month = get_month(data['date'])
            project_id = get_project_name(data['project_name_id'])

            # Create new build status from the provided data
            new_build_status = BuildStatus(
                month=date_in_month,
                date=data['date'],
                total_build_received=data['total_build_received'],
                builds_accepted=data['builds_accepted'],
                builds_rejected=data['builds_rejected'],
                project_name_id=project_id.id,
                user_id=int(get_jwt_identity())
            )

            # Add the new build status to the database
            db.session.add(new_build_status)
            db.session.commit()

            return jsonify(new_build_status.to_dict()), 201  # Return created status with a 201 status
        

    @app.route('/build_status/<int:id>', methods=['GET'])
    @jwt_required()
    def build_status(id):   
        if request.method == 'GET':
            #get only last three month recored
            # Handle GET request: Fetch all defects


            user_id = int(get_jwt_identity())
            defects = BuildStatus.query.all()
            print(defects)
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([BuildStatus],month,user_id,project_id=id)
            print(result)
            return jsonify(result)

    # API endpoint to handle PUT and DELETE for '/build_status/<int:id>'
    @app.route('/build_status/<int:id>', methods=['PUT', 'DELETE'])
    @jwt_required()
    def update_or_delete_build_status(id):
        # Get the build status by ID
        build_status = BuildStatus.query.get_or_404(id)

        if request.method == 'PUT':
            # If the method is PUT, update the build status
            data = request.json

            # Required fields for PUT request
            required_fields = [ 'date', 'total_build_received', 'builds_accepted', 'builds_rejected',   'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
            
            date_in_month = get_month(data['date'])
            # project_id = get_project_name(data['project_name_id']).id

            # Update the build status fields
            build_status.month = date_in_month
            build_status.date = data['date']
            build_status.total_build_received = data['total_build_received']
            build_status.builds_accepted = data['builds_accepted']
            build_status.builds_rejected = data['builds_rejected']
            build_status.project_name_id = data['project_name_id']
            build_status.user_id = int(get_jwt_identity())

            # Commit changes to the database
            db.session.commit()
            return jsonify(build_status.to_dict())

        elif request.method == 'DELETE':
            # If the method is DELETE, remove the build status
            db.session.delete(build_status)
            db.session.commit()
            return '', 204  # Return an empty response after successful deletion



                         #_________for form 5 in bugs table________

    @app.route('/defect_accepted_rejected/<int:id>', methods=['GET'])
    @jwt_required()
    def manage_defect_accepted_rejected_get(id):   
        if request.method == 'GET':
            #get only last three month recored
            # Handle GET request: Fetch all defects


            user_id = int(get_jwt_identity())
            defects = DefectAcceptedRejected.query.all()
            print(defects)
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([DefectAcceptedRejected],month,user_id,project_id=id)

            return jsonify(result)


    @app.route('/defect_accepted_rejected', methods=['GET', 'POST'])
    @jwt_required()
    def manage_defect_accepted_rejected():
        if request.method == 'GET':
            # Handle GET request: Fetch all defect accepted/rejected records
            
            user_id = int(get_jwt_identity())
            build_statuses = DefectAcceptedRejected.query.all()
            month = get_mon_database(build_statuses,user_id)
            print(month)

            result = get_details_month([DefectAcceptedRejected],month,user_id)

            return jsonify(result)


        elif request.method == 'POST':
            # Handle POST request: Create a new defect accepted/rejected record
            data = request.json

            # Required fields for POST request
            required_fields = [ 'date', 'total_defects', 'dev_team_accepted', 'dev_team_rejected', 'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
            
            date_in_month = get_month(data['date'])
            project_id = get_project_name(data['project_name_id']).id

            # Create new defect accepted/rejected record from the provided data
            new_defect_record = DefectAcceptedRejected(
                month=date_in_month,
                date=data['date'],
                total_defects=data['total_defects'],
                dev_team_accepted=data['dev_team_accepted'],
                dev_team_rejected=data['dev_team_rejected'],
                project_name_id=project_id,
                user_id=int(get_jwt_identity())
            )

            # Add the new defect accepted/rejected record to the database
            db.session.add(new_defect_record)
            db.session.commit()

            return jsonify(new_defect_record.to_dict()), 201  # Return created record with a 201 status

    # API endpoint to handle PUT and DELETE for '/defect_accepted_rejected/<int:id>'
    @app.route('/defect_accepted_rejected/<int:id>', methods=['PUT', 'DELETE'])
    @jwt_required()
    def update_or_delete_defect_accepted_rejected(id):
        # Get the defect accepted/rejected record by ID
        defect_record = DefectAcceptedRejected.query.get_or_404(id)

        if request.method == 'PUT':
            # If the method is PUT, update the defect accepted/rejected record
            data = request.json

            # Required fields for PUT request
            required_fields = [ 'date', 'total_defects', 'dev_team_accepted', 'dev_team_rejected', 'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
                
            date_in_month = get_month(data['date'])
            # project_id = get_project_name(data['project_name_id']).id

            # Update the defect accepted/rejected record fields
            defect_record.month = date_in_month
            defect_record.date = data['date']
            defect_record.total_defects = data['total_defects']
            defect_record.dev_team_accepted = data['dev_team_accepted']
            defect_record.dev_team_rejected = data['dev_team_rejected']
            defect_record.project_name_id = data['project_name_id']
            defect_record.user_id = int(get_jwt_identity())

            # Commit changes to the database
            db.session.commit()
            return jsonify(defect_record.to_dict())

        elif request.method == 'DELETE':
            # If the method is DELETE, remove the defect accepted/rejected record
            db.session.delete(defect_record)
            db.session.commit()
            return '', 204  # Return an empty response after successful deletion
        


                        # _________for 6 in bugs table_________

    @app.route('/test_case_creation_status/<int:id>', methods=['GET'])
    @jwt_required()
    def manage_test_case_creation_status_get(id):   
        if request.method == 'GET':
            #get only last three month recored
            # Handle GET request: Fetch all defects


            user_id = int(get_jwt_identity())
            defects = TestCaseCreationStatus.query.all()
            print(defects)
            month = get_mon_database(defects,user_id)
            print(month)

            result = get_details_month([TestCaseCreationStatus],month,user_id,project_id=id)

            return jsonify(result)

    @app.route('/test_case_creation_status', methods=['GET', 'POST'])
    @jwt_required()
    def manage_test_case_creation_status():
        if request.method == 'GET':
            # Handle GET request: Fetch all test case creation status records

            user_id = int(get_jwt_identity())
            build_statuses = TestCaseCreationStatus.query.all()
            month = get_mon_database(build_statuses,user_id)
            print(month)

            result = get_details_month([TestCaseCreationStatus],month,user_id)

            return jsonify(result)


        elif request.method == 'POST':
            # Handle POST request: Create a new test case creation status record
            data = request.json

            # Required fields for POST request
            required_fields = [ 'date', 'total_test_case_created', 'test_case_approved', 'test_case_rejected',  'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
                
            
            date_in_month = get_month(data['date'])
            project_id = get_project_name(data['project_name_id']).id

            # Create new test case creation status record from the provided data
            new_test_case_record = TestCaseCreationStatus(
                month=date_in_month,
                date=data['date'],
                total_test_case_created=data['total_test_case_created'],
                test_case_approved=data['test_case_approved'],
                test_case_rejected=data['test_case_rejected'],
                project_name_id=project_id,
                user_id=int(get_jwt_identity())
            )

            # Add the new test case creation status record to the database
            db.session.add(new_test_case_record)
            db.session.commit()

            return jsonify(new_test_case_record.to_dict()), 201  # Return created record with a 201 status

    # API endpoint to handle PUT and DELETE for '/test_case_creation_status/<int:id>'
    @app.route('/test_case_creation_status/<int:id>', methods=['PUT', 'DELETE'])
    @jwt_required()
    def update_or_delete_test_case_creation_status(id):
        # Get the test case creation status record by ID
        test_case_record = TestCaseCreationStatus.query.get_or_404(id)

        if request.method == 'PUT':
            # If the method is PUT, update the test case creation status record
            data = request.json

            # Required fields for PUT request
            required_fields = [ 'date', 'total_test_case_created', 'test_case_approved', 'test_case_rejected',  'project_name_id']

            # Check if all required fields are present in the request body
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            date_in_month = get_month(data['date'])
            # project_id = get_project_name(data['project_name_id']).id

            # Update the test case creation status record fields
            test_case_record.month = date_in_month
            test_case_record.date = data['date']
            test_case_record.total_test_case_created = data['total_test_case_created']
            test_case_record.test_case_approved = data['test_case_approved']
            test_case_record.test_case_rejected = data['test_case_rejected']
            test_case_record.project_name_id = int(data["project_name_id"])
            test_case_record.user_id = int(get_jwt_identity())

            # Commit changes to the database
            db.session.commit()
            return jsonify(test_case_record.to_dict())

        elif request.method == 'DELETE':
            # If the method is DELETE, remove the test case creation status record
            db.session.delete(test_case_record)
            db.session.commit()
            return '', 204  # Return an empty response after successful deletion
        


    # ________________________get the tester details by project name__________________________
    
    @app.route("/tester_name_by_project/<int:id>",methods=["GET"])
    @jwt_required()
    def tester_name_by_project(id):
        if request.method == 'GET':
            #to get the all the test details by using the project_name_id
            print("inside")
            user_id = int(get_jwt_identity())
            tester_name = Testers.query.filter_by(project_name_id=id).all()
            tester_name = [trash.to_dict() for trash in tester_name]
            if tester_name:
                return jsonify(tester_name),200
            else:
                return jsonify("dont have the data"),404

        
                         #__________for manager view________


    @app.route('/full_test_details/<int:id>', methods=['GET'])
    @jwt_required()
    def manage_full_test_details(id):
        if request.method == 'GET':
            #to get the all the test details by using the project_name_id
            print("inside")
            user_id = int(get_jwt_identity())
            role = Users.query.filter_by(id=user_id).first()
            role = role.role
            if role == "TestLead":
                return jsonify("your not authorized"),401

            # to get the project name 
            project_name = Project_name.query.get_or_404(id)
            project_name = project_name.project_name

            list_of_databsae = [New_defects,Test_execution_status,Total_Defect_Status,BuildStatus,DefectAcceptedRejected,TestCaseCreationStatus]

            filter_data = []

            for trash in list_of_databsae:
                temp_variable = trash.query.filter_by(project_name_id=id).all()
                filter_data.append(temp_variable)

            dict_collection = []


            # for trash in filter_data:
            #     for trash1 in trash:
            #         dict_collection.append(trash1.to_dict())



            #codium code
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


            # print(dataframe_collection)
            collection_dataframe_month = []


            for trash in dataframe_collection:
                # Group by 'Year' and 'Month'
                temp_df = trash.groupby(['Year', 'Month'])

                # Sort each group by date (assuming there is a 'Date' column to sort by)
                temp_df_sorted = temp_df.apply(lambda x: x.sort_values(by='date', ascending=False))

                # Select the latest 3 records from each group
                latest_three = temp_df_sorted.head(3)

                # Append the latest three records to the collection
                collection_dataframe_month.append(latest_three)
            

            # print(collection_dataframe_month)
            
            # print(collection_dataframe_month)
            
            print(len(collection_dataframe_month))

            final_dat = []

            #converting the datadeam to dict 

            for trash in collection_dataframe_month:
                # temp_dict = []
                print(trash)
                print(type(trash))
                temp_dict  =  trash.to_dict(orient='records')
                final_dat.append(temp_dict)

            print(len(final_dat))

            list_of_databsae = ["New_defects","Test_execution_status","Total_Defect_Status","BuildStatus","DefectAcceptedRejected","TestCaseCreationStatus"]
            final_data = {}

            for trash in range(6):
                final_data[list_of_databsae[trash]] = final_dat[trash]
            
            
            return jsonify(final_data)





            # for trash in collection_dataframe_month:
            #     print(type(trash))
            #     latest = trash.sort_values(by = ['date', 'Month'], ascending = [False, False])
            #     final_data.append(latest.head(3))

            # for trash in final_data:
            #     print(trash)

            #here i have the month of the table have
            month = get_mon_full_details(list_of_databsae,id)
            print(month)
            collection_data = {}
            for trash in list_of_databsae:
                for trash1 in month:
                    # print(trash)
                    temp_variable = trash.query.filter_by(project_name_id=id, month=trash1).order_by(trash.date.desc()).first()
                    if temp_variable is None:
                        continue
                    else:
                        # Get the key for the current table (using `get_var_name`)
                        key = get_var_name(trash)
                        # print(key)

                        # Check if the key exists in the dictionary
                        if key not in collection_data:
                            collection_data[key] = []

                        # Append a new dictionary with the index to the list under the key
                        collection_data[key].append(temp_variable.to_dict())

                        continue  # Continue with the next iteration of the inner loop
                
                
            # print(collection_data)

            return jsonify({"test_project_details":collection_data,"project_name":project_name})