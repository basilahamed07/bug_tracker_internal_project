from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus,Tester_name,Metrics,AgileDetails,SprintDetails,TestingType
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
        user_id = get_jwt_identity()
        print("JWT user_id:", user_id)  # Debugging: check the JWT identity
        
        if request.method == "POST":
            data = request.json
            print("Received data:", data)  # Print the incoming request data
            
            if "project_name" not in data:
                return jsonify({"error": "Project name is required"}), 400
            
            project_name = data.get("project_name")

            if Project_name.query.filter_by(project_name=project_name).first():
                return jsonify({"error": "Project name already exists"}), 400
            
            project = Project_name(project_name=project_name, user_id=user_id)
            
            try:
                db.session.add(project)
                db.session.commit()
                return jsonify({"message": "Project created successfully", "user_id": user_id,"project_id":project.id}), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({"error": str(e)}), 500
        
        elif request.method == "GET":
            projects = Project_name.query.all()
            return jsonify({"projects": [project.to_dict() for project in projects]}), 200
                

    @app.route("/pending-project", methods=["GET"])
    @jwt_required()
    def pending_project():
        user_id = int(get_jwt_identity())
        project_nameid= Project_name.query.filter_by(user_id=user_id).all()
        project_name_id_array = [trash.id for trash in project_nameid]
        pending_project = []
        for tarsh in project_name_id_array:
            if Project_details.query.filter_by(project_name_id=tarsh).first():
                continue
            else:
                temp = Project_name.query.filter_by(id=tarsh).first()
                pending_project += [temp.project_name]
        # project_id = project_nameid.id
        return jsonify({"sample_data":pending_project})
        
    #gpt code 
    @app.route("/delete-project/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_project(id):
        user_id = int(get_jwt_identity())

        # Fetch the project details based on the provided project ID
        project_details = Project_details.query.filter_by(id=id).first()

        if not project_details:
            return jsonify({"message": "Project not found"}), 404

        project_name_id = project_details.project_name_id

        # Fetch all related entities using the project_name_id
        project_name = Project_name.query.filter_by(id=project_name_id).first()
        testers = Testers.query.filter_by(project_name_id=project_name_id).all()
        # testers_id = [trash.tester_name_id for trash in testers ]
        # tester_name = Tester_name.query.filter_by(id=testers_id).all()
        build_status = BuildStatus.query.filter_by(project_name_id=project_name_id).all()
        defect_accept_reject = DefectAcceptedRejected.query.filter_by(project_name_id=project_name_id).all()
        new_defects = New_defects.query.filter_by(project_name_id=project_name_id).all()
        test_case_creation_status = TestCaseCreationStatus.query.filter_by(project_name_id=project_name_id).all()
        test_execution_status = Test_execution_status.query.filter_by(project_name_id=project_name_id).all()
        total_defect_status = Total_Defect_Status.query.filter_by(project_name_id=project_name_id).all()
        metrics_input = Metrics.query.filter_by(project_name_id=project_name_id).all()
        agile_details = AgileDetails.query.filter_by(project_name_id=project_name_id).all()
        sprint_details = SprintDetails.query.filter_by(project_name_id=project_name_id).all()
        tester_type = TestingType.query.filter_by(project_name_id=project_name_id).all()

        # Deleting related records
        for item in [metrics_input,testers, build_status, defect_accept_reject, new_defects,
                     test_case_creation_status, test_execution_status, total_defect_status,agile_details,sprint_details,tester_type]:
            for record in item:
                db.session.delete(record)

        # for trash in testers_id:
        #     tester_name = Tester_name.query.filter_by(id=testers_id).first()
        #     db.session.delete(tester_name)

        # Deleting the project details related to the project
        db.session.delete(project_details)

        # Deleting the project name record
        if project_name:
            db.session.delete(project_name)

        # Commit the transaction
        db.session.commit()

        return jsonify({"message": "Project and all related data deleted successfully"}), 200




# -----------------------------------------code ----------------------------------------------------
    @app.route("/update-project/<int:id>", methods=["PUT"])
    @jwt_required()
    def update_project(id):
        user_id = get_jwt_identity()
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
        
        try:
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
        user_id = get_jwt_identity()

        
        
        
        data = request.json
        print("Received data:", data)  # Debugging: print the incoming request data
        
        #check if the user_id and project_name.user_id are same



        # Create a list of billable and non-billable tester IDs
        billable = []
        nonbillable = []

        for trash in data["testers"]:
            if trash.get("billable") == True:
                billable.append(get_tester_id(trash.get("tester_name")).id)
            else:
                nonbillable.append(get_tester_id(trash.get("tester_name")).id)

        #FOR get the project_id by using the project_name

        project_id = get_project_name(data["project_name"])

        if project_id.user_id == int(user_id):
            pass
        else:
            return jsonify({"error": "You are not authorized to create this project detail"}), 403

        # Required fields
        required_fields = ["project_name", "rag", "tester_count" 
                           ]
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
        
        try:
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
        user_id = get_jwt_identity()

        user_role = Users.query.filter_by(id=user_id).first()
        user_role = user_role.role
        
        if user_role == "admin":
            project_details = Project_details.query.all()
            return jsonify({
                "project_details": [
                    {
                        **project.to_dict(),
                        "project_name": project.project_name.project_name
                        
                        }
                        for project in project_details
                    ]
                                }), 200
        
        project_details = Project_details.query.filter_by(user_id=user_id).all()
        proejct_name_id = project_details[0].project_name_id
        project_name = Project_name.query.filter_by(id=proejct_name_id).first()
        
        response = {
        "project_details": [
            {**project.to_dict(), "project_name": project.project_name.project_name} 
            for project in project_details
        ]
    }
        return jsonify(response)
        # return jsonify({"project_details": [{**project.to_dict(),"project_name":project_name}for project in project_details]}), 200
    
    @app.route("/project-details-manager-view", methods=["GET"])
    @jwt_required()
    def get_project_details_manager():
        user_id = get_jwt_identity()
        
        project_details = Project_details.query.all()

        return jsonify({
    "project_details": [
        {
            **project.to_dict(),
            "project_name": project.project_name.project_name  # Access the related project_name
        }
        for project in project_details
    ]
}), 200
        # return jsonify({"project_details": [{**project.to_dict(),"project_name":project.project_name_id} for project in project_details]}), 200

    # Route to update project details
    # @app.route("/update-project-details/<int:id>", methods=["PUT"])
    # @jwt_required()
    # def update_project_details(id):
    #     user_id = int(get_jwt_identity())
        
    #     data = request.json
    #     project_detail = Project_details.query.get(id)
    #     print(data)
        
    #     project_name = Project_name.query.filter_by(project_name=data["project_name"]).first()
    #     project_name =project_name.id
        

    #     print(project_detail.user_id)
        
    #     if not project_detail:
    #         return jsonify({"error": "Project details not found"}), 404
        
    #     print(f"user_id: {project_detail.user_id}")

    #     automaction = ""
    #     ai_used = ""

    #     if data["automation"] == None:
    #         automaction = ""
    #     else:
    #         automaction = data["automation"]

    #     if data["ai_used"] == None:
    #         ai_used = ""
    #     else:
    #         ai_used = data["ai_used"]


    #     billable_ids = []
    #     nonbillable_ids = []
    #     #add the terster details

    #     tester_names_check = Testers.query.filter_by(project_name_id=project_name).all()
        
        
    #     print("check the tester name",tester_names_check)

    #     name_check = [trash.tester_name_id for trash in tester_names_check]

    #     print("name check",name_check)

    #     non_id = []

    #     length = len(data["billable"])
    #     length = int(length)
    #     print("length check",length)
    #     index = 0
        
    #     # Iterate through 'name_check' (which seems to be a list or iterable)
    #     for trash in name_check:
    #         print("Inside the tester billable")
    
    #         # Retrieve a record from the 'Tester_name' table based on the ID 'trash'
    #         name_checks = Tester_name.query.filter_by(id=trash).first()
    
    #         # Get the 'tester_name' value from the result
    #         temp_name = name_checks.tester_name
    
    #         # If the 'length' is zero, we break the loop
    #         if length == 0:
    #             print("Length is 0")
    #             break
            
    #         # If the 'length' is less than or equal to 'index', we break the loop
    #         elif length <= index:
    #             print("Length is less than or equal to index")
    #             break
            
    #         # Otherwise, proceed with the comparison
    #         else:
    #             # If the name in data["billable"][index] matches temp_name, we do nothing
    #             if data["billable"][index] == temp_name:
    #                 print("Data and temp name are the same")
    #                 pass  # No action needed here
                
    #             # If the names don't match, append the ID to 'non_id'
    #             else:
    #                 print("Data and temp name are not the same")
    #                 non_id.append(trash)
    
    #         # Increment the index for the next iteration
    #         index += 1   
        



    #     length = len(data["nonbillable"])
    #     index = 0
    #     for trash in name_check:
    #         print("inside the tester nonbillable")
    #         name_checks = Tester_name.query.filter_by(id=trash).first()
    #         print(name_check)
    #         temp_name = name_checks.tester_name
    #         print(temp_name)
    #         if length == 0:
    #             print("length is 0")
    #             break
    #         elif length >= index:
    #             print("length is less than index")
    #             break
    #         else:
    #             if data["nonbillable"][index] == temp_name:
    #                 print("data and temp name is same")
    #                 pass
    #             else:
    #                 print("data and temp name is not same")
    #                 non_id.append(trash)
    #         index+=1    
            
        
    #     # print(billable_ids)
    #     # print(nonbillable_ids)

    #     print(non_id)
        
    #     for trash in non_id:
    #         delete_data = Testers.query.filter_by(tester_name_id = trash).first()
    #         try:
    #             print("deleted the data")
    #             db.session.delete(delete_data) 
    #             db.session.commit()
    #         except:
    #             print("error on delete the tester_name")


    #     print("before the for loop")
    #     # for billable
    #     for trash in data["billable"]:
    #         check = Tester_name.query.filter_by(tester_name=trash).first()
    #         if check == None:
    #             tester_add = Tester_name(tester_name=trash, user_id=user_id)
    #             db.session.add(tester_add)
    #             db.session.commit()
    #             tester_name_id = tester_add.id

    #             billable = Testers(tester_name_id=tester_name_id, billable=True, project_name_id=project_name,      user_id=user_id)
    #             db.session.add(billable)
    #             db.session.commit()

    #             billable_ids.append(billable.tester_name_id)
    #         else:
    #             ids = Testers.query.filter_by(tester_name_id=check.id,project_name_id=project_name).first()
    #             if ids == None:
    #                 new_tester_add = Testers(tester_name_id=check.id, billable=True, project_name_id=project_name,   user_id=user_id)
    #                 db.session.add(new_tester_add)
    #                 db.session.commit()

    #                 tester_name_id = new_tester_add.id
    #                 billable_ids.append(new_tester_add.tester_name_id)  # Ensure you're appending to billable_ids
    #             else:
    #                 print(f"Tester already exists: {check.tester_name}")
    #                 billable_ids.append(check.id)

    #     # for nonbillable
    #     for trash in data["nonbillable"]:
    #         check = Tester_name.query.filter_by(tester_name=trash).first()
    #         if check == None:
    #             tester_add = Tester_name(tester_name=trash, user_id=user_id)
    #             db.session.add(tester_add)
    #             db.session.commit()
    #             tester_name_id = tester_add.id

    #             nonbillable = Testers(tester_name_id=tester_name_id, billable=False, project_name_id=project_name,      user_id=user_id)
    #             db.session.add(nonbillable)
    #             db.session.commit()

    #             nonbillable_ids.append(nonbillable.tester_name_id)
    #         else:
    #             ids = Testers.query.filter_by(tester_name_id=check.id,project_name_id=project_name).first()
    #             if ids == None:
    #                 new_tester_add = Testers(tester_name_id=check.id, billable=False, project_name_id=project_name,         user_id=user_id)
    #                 db.session.add(new_tester_add)
    #                 db.session.commit()

    #                 nonbillable_ids.append(new_tester_add.tester_name_id)  # Ensure you're appending to nonbillable_ids
    #             else:
    #                 print(f"Tester already exists: {check.tester_name}")
    #                 nonbillable_ids.append(check.id)  # Add to nonbillable list

    #         # nonbillable = Testers(tester_name=trash,billable=False,project_name_id=project_name,user_id=user_id)
    #         # db.session.add(nonbillable)
    #         # db.session.commit()

    #         # nonbillable_ids.append(nonbillable.id)
        
        
    #     # if project_detail.user_id != int(user_id):
    #     #     return jsonify({"error": "You are not authorized to update this project detail"}), 403
        
    #     # Update project detail fields
    #     # print("non billable")
    #     # print(nonbillable_ids)
    #     # print(billable_ids)
    #     # print("billable")

    #     count = len(nonbillable_ids) + len(billable_ids)

    #     if "project_name_id" in data:
    #         project_detail.project_name_id = project_name
    #     if "rag" in data:
    #         project_detail.rag = data["rag"]
    #     if "tester_count" in data:
    #         project_detail.tester_count = count
    #     if "billable" in data:
    #         project_detail.billable = billable_ids
    #     if "nonbillable" in data:
    #         project_detail.nonbillable = nonbillable_ids
    #     if "billing_type" in data:
    #         project_detail.billing_type = data["billing_type"]
    #     if "automation" in data:
    #         project_detail.automation = automaction
    #     if "ai_used" in data:
    #         project_detail.ai_used = ai_used
    #     if "rag_details" in data:
    #         project_detail.rag_details = data["rag_details"]
        
    #     # print("inset the data")
    #     try:
    #         db.session.commit()
    #         return jsonify({"message": "Project details updated successfully"}), 200
    #     except Exception as e:
    #         db.session.rollback()
    #         return jsonify({"error": str(e)}), 500


    # -----------------------------------gpt code here for update the project along with tester details-------------------------------------
    @app.route("/update-project-details/<int:id>", methods=["PUT"])
    @jwt_required()
    def update_project_details(id):
        user_id = int(get_jwt_identity())

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
        try:
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
        user_id = get_jwt_identity()
        
        project_detail = Project_details.query.get(id)

        
        if not project_detail:
            return jsonify({"error": "Project details not found"}), 404
        
        if project_detail.user_id != int(user_id):
            return jsonify({"error": "You are not authorized to delete this project detail"}), 403
        
        try:
            db.session.delete(project_detail)
            db.session.commit()
            return jsonify({"message": "Project details deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
        
    
    
      