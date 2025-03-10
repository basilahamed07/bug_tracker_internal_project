from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus,Tester_name,Metrics,AgileDetails,SprintDetails,TestingType,StoryDetails
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
import os
from datetime import date

#logic for get assign the month recoding to the date

#logic for tester_detais

def get_tester_id(tester_name):
    tester = Tester_name.query.filter_by(tester_name=tester_name).first()
    return tester


#for get the project id for corrosponding project name
def get_project_name(project_name):
    project = Project_name.query.filter_by(project_name=project_name).first()
    return project



# convert the date into month
def get_month(date_str):
    if len(date_str) > 10:
        date_obj = date.fromisoformat(date_str[0:10])
        return date_obj.strftime('%B')
    else:
        date_obj = date.now()
        return date_obj.strftime('%B')



def project_details_route(app):

    
        # 
    # @verify_jwt_in_request()
    @app.route("/create-project", methods=["GET", "POST"])
    @jwt_required()
    def create_project():
        try:
            user_id = get_jwt_identity()
            print("JWT user_id:", user_id)  # Debugging: check the JWT identity

            if request.method == "POST":
                data = request.json
                print("Received data:", data)  # Print the incoming request data

                # Check if the required field 'project_name' is in the request
                if "project_name" not in data:
                    return jsonify({"error": "Project name is required"}), 400

                project_name = data.get("project_name")

                # Check if the project name already exists
                if Project_name.query.filter_by(project_name=project_name).first():
                    return jsonify({"error": "Project name already exists"}), 400

                # Create a new project
                project = Project_name(project_name=project_name, user_id=user_id)

                # Attempt to add the project to the database
                try:
                    db.session.add(project)
                    db.session.commit()
                    return jsonify({
                        "message": "Project created successfully", 
                        "user_id": user_id,
                        "project_id": project.id
                    }), 201
                except Exception as e:
                    db.session.rollback()
                    return jsonify({"error": f"Failed to create project: {str(e)}"}), 500

            elif request.method == "GET":
                # Fetch all projects for the authenticated user
                projects = Project_name.query.all()

                # Return the projects as a list of dictionaries
                return jsonify({"projects": [project.to_dict() for project in projects]}), 200

        except Exception as e:
            # Catch any unexpected errors and return a server error message
            return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


    @app.route("/pending-project", methods=["GET"])
    @jwt_required()
    def pending_project():
        try:
            user_id = int(get_jwt_identity())  # Get the user ID from JWT token

            # Get all project names related to the user
            project_nameid = Project_name.query.filter_by(user_id=user_id).all()

            # Extract project IDs into an array
            project_name_id_array = [project.id for project in project_nameid]

            # Initialize an empty list for pending projects
            pending_project = []

            # Iterate over each project ID to check if there are related project details
            for project_id in project_name_id_array:
                project_details = Project_details.query.filter_by(project_name_id=project_id).first()
                if not project_details:
                    # If no project details exist, add project name to the pending list
                    project_name = Project_name.query.filter_by(id=project_id).first()
                    if project_name:  # Check if the project name exists
                        pending_project.append(project_name.project_name)

            return jsonify({"pending_projects": pending_project}), 200

        except Exception as e:
            return jsonify({"error": f"An error occurred while fetching pending projects: {str(e)}"}), 500

        
    @app.route("/delete-project/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_project(id):
        try:
            user_id = int(get_jwt_identity())  # Get user ID from JWT token
    
            # Fetch the project details based on the provided project ID
            project_details = Project_details.query.filter_by(id=id).first()
    
            if not project_details:
                return jsonify({"message": "Project not found"}), 404
    
            project_name_id = project_details.project_name_id
    
            # Ensure that project_name_id is not None
            if not project_name_id:
                return jsonify({"message": "Project's project_name_id is missing"}), 400
    
            # Fetch the project name record and related entities using the project_name_id
            project_name = Project_name.query.filter_by(id=project_name_id).first()
            testers = Testers.query.filter_by(project_name_id=project_name_id).all()
            build_status = BuildStatus.query.filter_by(project_name_id=project_name_id).all()
            defect_accept_reject = DefectAcceptedRejected.query.filter_by(project_name_id=project_name_id).all()
            new_defects = New_defects.query.filter_by(project_name_id=project_name_id).all()
            test_case_creation_status = TestCaseCreationStatus.query.filter_by(project_name_id=project_name_id).all ()
            test_execution_status = Test_execution_status.query.filter_by(project_name_id=project_name_id).all()
            total_defect_status = Total_Defect_Status.query.filter_by(project_name_id=project_name_id).all()
            metrics_input = Metrics.query.filter_by(project_name_id=project_name_id).all()
            agile_details = AgileDetails.query.filter_by(project_name_id=project_name_id).all()
            sprint_details = SprintDetails.query.filter_by(project_name_id=project_name_id).all()
            tester_type = TestingType.query.filter_by(project_name_id=project_name_id).all()
    
            # Deleting related records
            related_records = [
                metrics_input, testers, build_status, defect_accept_reject, new_defects,
                test_case_creation_status, test_execution_status, total_defect_status,
                agile_details, tester_type
            ]
    
            with db.session.no_autoflush:
                for records in related_records:
                    for record in records:
                        db.session.delete(record)
    
                # Delete related StoryDetails for each SprintDetails
                for sprint in sprint_details:
                    story_details = StoryDetails.query.filter_by(sprint_detail_id=sprint.id).all()
                    for story in story_details:
                        db.session.delete(story)
                    db.session.delete(sprint)
    
                # Deleting the project details related to the project
                db.session.delete(project_details)
    
                # Deleting the project name record
                if project_name:
                    db.session.delete(project_name)
    
                # Commit the transaction
                db.session.commit()
    
            return jsonify({"message": "Project and all related data deleted successfully"}), 200
    
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"An error occurred while deleting the project: {str(e)}"}), 500
# -----------------------------------------code ----------------------------------------------------
    @app.route("/update-project/<int:id>", methods=["PUT"])
    @jwt_required()
    def update_project(id):
        try:
            user_id = get_jwt_identity()  # Get user ID from JWT token
            print(f"JWT user_id: {user_id}")  # Debugging: check the JWT identity
    
            # Fetch the project by ID
            project = Project_name.query.get(id)
    
            if not project:
                return jsonify({"error": "Project not found"}), 404
            
            # Ensure the current user is the owner of the project
            if project.user_id != int(user_id):
                return jsonify({"error": "You are not authorized to update this project"}), 403
            
            # Get the data from the request
            data = request.json
            print("Received data:", data)  # Debugging: print the incoming request data
    
            # Update the project details if provided in the request
            if "project_name" in data:
                project.project_name = data["project_name"]
            
            # Commit the changes
            db.session.commit()
            return jsonify({"message": "Project updated successfully"}), 200
    
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

                

         #for here create the project details       
        # Route to create new project details
    @app.route("/create-project-details", methods=["POST"])
    @jwt_required()
    def create_project_details():
        try:
            user_id = get_jwt_identity()  # Get user ID from JWT token
            data = request.json
            print("Received data:", data)  # Debugging: print the incoming request data

            # Check if the project exists and if the user has permission
            project_id = get_project_name(data["project_name"])

            if project_id.user_id != int(user_id):
                return jsonify({"error": "You are not authorized to create this project detail"}), 403

            # Create a list of billable and non-billable tester IDs
            billable = [get_tester_id(t["tester_name"]).id for t in data["testers"] if t.get("billable")]
            nonbillable = [get_tester_id(t["tester_name"]).id for t in data["testers"] if not t.get("billable")]

            # Required fields
            required_fields = ["project_name", "rag", "tester_count", "rag_details"]
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"{field} is required"}), 400

            # Create a new Project_details object
            project_detail = Project_details(
                project_name_id=project_id.id,
                rag=data["rag"],
                tester_count=data["tester_count"],
                billable=billable,
                nonbillable=nonbillable,
                billing_type=data["billing_type"],
                automation=data.get("automation_details"),
                ai_used=data.get("ai_used_details"),
                rag_details=data["rag_details"],
                user_id=user_id,
                agile=data.get("agile_type")
            )

            # Add to session and commit
            db.session.add(project_detail)
            db.session.commit()
            return jsonify({"message": "Project details created successfully"}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    # Route to get all project details for a user
    @app.route("/project-details", methods=["GET"])
    @jwt_required()
    def get_project_details():
        try:
            user_id = get_jwt_identity()  # Get user ID from JWT token

            # Fetch user role to determine access
            user_role = Users.query.filter_by(id=user_id).first().role

            if user_role == "admin":
                project_details = Project_details.query.all()
            else:
                project_details = Project_details.query.filter_by(user_id=user_id).all()

            # Prepare response with project details and project names
            response = {
                "project_details": [
                    {**project.to_dict(), "project_name": project.project_name.project_name}
                    for project in project_details
                ]
            }

            return jsonify(response), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/project-details-manager-view", methods=["GET"])
    @jwt_required()
    def get_project_details_manager():
        try:
            # Fetch all project details
            project_details = Project_details.query.all()

            # Prepare response with project details and project names
            response = {
                "project_details": [
                    {**project.to_dict(), "project_name": project.project_name.project_name}
                    for project in project_details
                ]
            }

            return jsonify(response), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500


    # -----------------------------------gpt code here for update the project along with tester details-------------------------------------
    @app.route("/update-project-details/<int:id>", methods=["PUT"])
    @jwt_required()
    def update_project_details(id):
        try:
            user_id = int(get_jwt_identity())  # Get user ID from JWT token

            # Retrieve the incoming JSON data
            data = request.json
            project_detail = Project_details.query.get(id)

            if not project_detail:
                return jsonify({"error": "Project details not found"}), 404

            # Fetch the project name ID
            project_name = Project_name.query.filter_by(project_name=data["project_name"]).first()
            if not project_name:
                return jsonify({"error": "Project name not found"}), 404
            project_name_id = project_name.id

            # Set default values for automation and ai_used if not provided
            automation = data.get("automation", "")
            ai_used = data.get("ai_used", "")

            # Helper function to handle tester updates (for both billable and nonbillable)
            def update_testers(testers, is_billable):
                tester_ids = []
                for tester_name in testers:
                    tester = Tester_name.query.filter_by(tester_name=tester_name).first()
                    if not tester:
                        tester = Tester_name(tester_name=tester_name, user_id=user_id)
                        db.session.add(tester)
                        db.session.commit()

                    tester_name_id = tester.id
                    existing_tester = Testers.query.filter_by(tester_name_id=tester_name_id, project_name_id=project_name_id).first()
                    if not existing_tester:
                        tester_entry = Testers(tester_name_id=tester_name_id, billable=is_billable, project_name_id=project_name_id, user_id=user_id)
                        db.session.add(tester_entry)
                        db.session.commit()
                        tester_ids.append(tester_entry.tester_name_id)
                    else:
                        tester_ids.append(existing_tester.tester_name_id)
                return tester_ids

            # Get the list of existing tester names in the current project
            existing_testers = Testers.query.filter_by(project_name_id=project_name_id).all()
            existing_tester_ids = [tester.tester_name_id for tester in existing_testers]

            # Delete nonbillable testers that are no longer in the data
            nonbillable_testers = data.get("nonbillable", [])
            billable_testers = data.get("billable", [])

            # Update billable testers
            billable_ids = update_testers(billable_testers, True)
            nonbillable_ids = update_testers(nonbillable_testers, False)

            # Handle deletion of testers that are no longer associated with the project
            all_testers_to_delete = set(existing_tester_ids) - set(billable_ids + nonbillable_ids)
            for tester_id in all_testers_to_delete:
                tester_to_delete = Testers.query.filter_by(tester_name_id=tester_id, project_name_id=project_name_id).first()
                if tester_to_delete:
                    db.session.delete(tester_to_delete)
                    db.session.commit()

            # Update project details
            project_detail.project_name_id = project_name_id
            project_detail.rag = data.get("rag", project_detail.rag)
            project_detail.tester_count = len(billable_ids) + len(nonbillable_ids)
            project_detail.billable = billable_ids
            project_detail.nonbillable = nonbillable_ids
            project_detail.billing_type = data.get("billing_type", project_detail.billing_type)
            project_detail.automation = automation
            project_detail.ai_used = ai_used
            project_detail.rag_details = data.get("rag_details", project_detail.rag_details)

            # Commit the changes to the database
            db.session.commit()

            return jsonify({"message": "Project details updated successfully"}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


    # -----------------------------------gpt code here for update the project along with tester details-------------------------------------


    
    # Route to delete project details
    @app.route("/delete-project-details/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_project_details(id):
        try:
            user_id = get_jwt_identity()  # Get user ID from JWT token
    
            project_detail = Project_details.query.get(id)
    
            if not project_detail:
                return jsonify({"error": "Project details not found"}), 404
    
            # Check if the current user is the project owner
            if project_detail.user_id != int(user_id):
                return jsonify({"error": "You are not authorized to delete this project detail"}), 403
    
            # Delete project details
            db.session.delete(project_detail)
            db.session.commit()
    
            return jsonify({"message": "Project details deleted successfully"}), 200
    
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

        
    
    
      