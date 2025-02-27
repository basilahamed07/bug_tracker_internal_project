from flask import jsonify, request
from models import db,Project_name,Testers,Tester_name
from flask_jwt_extended import jwt_required,get_jwt_identity
from datetime import date
from sqlalchemy import create_engine, distinct

#logic for get assign the month recoding to the date


#for get the project id for corrosponding project name
def get_project_name(project_name):
    project = Project_name.query.filter_by(project_name=project_name).first()
    return project



def billable_details_route(app):
     #in this function post only the name of the billable resources
    
    #working fine for tester name 
    @app.route("/tester-billable", methods=["GET", "POST"])  # worked api 
    @jwt_required()
    def tester_billable():
        user_id = get_jwt_identity()
        if request.method == "POST":
            data = request.json
            print("Received data:", data)  # Print the incoming request data
            data = data["testers"]

            for trash in data:
                tester_name = trash.get("tester_name")
                project_name = trash.get("project_name")
                billable = trash.get("billable")
                project_id = get_project_name(project_name).id

                new_tester_name_id = 0
                checking = Tester_name.query.filter_by(tester_name=tester_name).first()
                if checking == None:
                    new_tester_name = Tester_name(tester_name=tester_name,user_id=user_id)
                    # new_tester_name_id = new_tester_name.id

                    try:
                        db.session.add(new_tester_name)
                        db.session.commit()
                        new_tester_name_id = new_tester_name.id



                    except Exception as e:
                        db.session.rollback()
                        return jsonify({"error": str(e)}), 500
                
                

                if new_tester_name_id == 0:
                    new_billable_resources = Testers(tester_name_id= checking.id, user_id=user_id, project_name_id=project_id,  billable=billable)
                else:
                    new_billable_resources = Testers(tester_name_id= new_tester_name_id, user_id=user_id, project_name_id=project_id,  billable=billable)
                try:        
                    db.session.add(new_billable_resources)
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                    return jsonify({"error": str(e)}), 500
            
            return jsonify({"message": "tester details created successfully", "user_id": user_id}), 201
        
        elif request.method == "GET":  
            # projects = Testers.query.all()

            tester_name = Tester_name.query.distinct(Tester_name.tester_name).all()

            # projects = Testers.query.distinct(Testers.tester_name_id).all()
            
            return jsonify({"testers": [tester.to_dict() for tester in tester_name]}), 200



# -------------------------------code by basil ---------------------------------





    # for getting the tester billable and nonbillable 
    @app.route("/project-base-billable/<int:id>", methods=["GET"]) #this api was used
    @jwt_required()
    def get_billabe_test(id):
        user_id = int(get_jwt_identity())

        # Use distinct() to filter out duplicates based on tester_name
        # billable = Testers.query.filter_by(project_name_id=id).distinct(Testers.tester_name_id,Testers.billable).all()
        billable = Testers.query.filter_by(project_name_id=id).all()
        # Get the project name
        project_name = Project_name.query.filter_by(id=id).first()

        # Return the unique testers and project name in the response
        return jsonify({"tester_info": [tester.to_dict() for tester in billable], "project_name": project_name.project_name})
    

    @app.route("/get_tester_details", methods=["POST"])   # this api was used
    @jwt_required()
    def get_tester_details():
        user_id = int(get_jwt_identity())
        data = request.get_json()
        billable_ids = data.get("ids", [])
        nonbillable_ids = data.get("nonbillable_ids", [])

        

        billable_testers = []
        nonbillable_testers = []

        for trash in billable_ids:
            billable_testers+= [Testers.query.filter_by(tester_name_id=trash).first()]

        for trash in nonbillable_ids:
            nonbillable_testers+= [Testers.query.filter_by(tester_name_id=trash).first()]



        # Convert to dictionary
        billable_testers_data = [tester.to_dict() for tester in billable_testers]
        nonbillable_testers_data = [tester.to_dict() for tester in nonbillable_testers]

        return jsonify({
            "billable_testers": billable_testers_data,
            "nonbillable_testers": nonbillable_testers_data
        })



# -------------------------------------end of the code billable--------------------------------------------------





















# -----------------------------------not used api ---------------------------------------------
    #for this put we want to use the update the project and billable or not
    # for here we all are update only project and billable when click the project details
    @app.route("/testers-billable/<int:id>", methods=["PUT"])
    @jwt_required()
    def update_tester(id):
        tester = Testers.query.get(id)
        if not tester:
            return jsonify({"error": "Tester not found"}), 404

        data = request.json
        print("Received data:", data)  # Print the incoming request data

        # If 'project_name' is provided, update project_name_id
        project_name = data.get("project_name")
        if project_name:
            # Assuming get_project_name() returns a Project_name object with an 'id' attribute
            project_name_id = get_project_name(project_name)  
            if project_name_id:
                # Assigning the project_name_id as a list (even if it's just a single ID)
                temp_number = tester.project_name_id
                tester.project_name_id = [temp_number,project_name_id.id]  # Ensure it's a list of integers
            else:
                return jsonify({"error": "Project name not found"}), 404

        # If 'billable' is provided, update the billable status
        billable = data.get("billable")
        if billable is not None:  # Check if billable is provided (could be a boolean)
            tester.billable = billable

        # Commit the changes to the database
        try:
            db.session.commit()
            return jsonify({"message": "Tester details updated successfully", "tester_id": tester.id}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500



# -----------------------------------not used api ---------------------------------------------



