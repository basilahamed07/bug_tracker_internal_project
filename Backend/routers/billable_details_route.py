from flask import jsonify, request
from models import db,Project_name,Testers,Tester_name
from flask_jwt_extended import jwt_required,get_jwt_identity
from datetime import date
from sqlalchemy import create_engine, distinct
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

#logic for get assign the month recoding to the date


#for get the project id for corrosponding project name
def get_project_name(project_name):
    project = Project_name.query.filter_by(project_name=project_name).first()
    return project



def billable_details_route(app):
     #in this function post only the name of the billable resources
    
   # Tester billable route (GET and POST)
    @app.route("/tester-billable", methods=["GET", "POST"])
    @jwt_required()
    def tester_billable():
        user_id = get_jwt_identity()

        if request.method == "POST":
            data = request.json
            print("Received data:", data)  # Print the incoming request data

            # Check if "testers" key exists in the request
            if "testers" not in data:
                return jsonify({"message": "No 'testers' data provided in the request"}), 400

            testers_data = data["testers"]

            # Loop through each tester and add them to the database
            for trash in testers_data:
                tester_name = trash.get("tester_name")
                project_name = trash.get("project_name")
                billable = trash.get("billable")

                if not tester_name or not project_name or billable is None:
                    return jsonify({"message": "Missing required fields (tester_name, project_name, or billable)"}), 400

                # Retrieve the project ID by project name
                project_id = get_project_name(project_name).id if get_project_name(project_name) else None
                if not project_id:
                    return jsonify({"message": f"Project '{project_name}' not found"}), 404

                # Check if tester already exists in the Tester_name table
                checking = Tester_name.query.filter_by(tester_name=tester_name).first()
                new_tester_name_id = 0

                if checking is None:
                    # If tester doesn't exist, create a new tester_name entry
                    new_tester_name = Tester_name(tester_name=tester_name, user_id=user_id)
                    try:
                        db.session.add(new_tester_name)
                        db.session.commit()
                        new_tester_name_id = new_tester_name.id
                    except IntegrityError as e:
                        db.session.rollback()
                        return jsonify({"message": "Integrity error while adding new tester name."}), 500
                    except SQLAlchemyError as e:
                        db.session.rollback()
                        return jsonify({"message": "Database error while adding new tester name."}), 500
                    except Exception as e:
                        db.session.rollback()
                        return jsonify({"message": f"Unexpected error: {str(e)}"}), 500

                # If tester already exists, get their ID
                if new_tester_name_id == 0:
                    tester_name_id = checking.id
                else:
                    tester_name_id = new_tester_name_id

                # Create a new billable resource
                new_billable_resources = Testers(
                    tester_name_id=tester_name_id,
                    user_id=user_id,
                    project_name_id=project_id,
                    billable=billable
                )

                # Add new billable resource to the database
                try:
                    db.session.add(new_billable_resources)
                    db.session.commit()
                except IntegrityError as e:
                    db.session.rollback()
                    return jsonify({"message": "Integrity error while adding billable resource."}), 500
                except SQLAlchemyError as e:
                    db.session.rollback()
                    return jsonify({"message": "Database error while adding billable resource."}), 500
                except Exception as e:
                    db.session.rollback()
                    return jsonify({"message": f"Unexpected error: {str(e)}"}), 500

            return jsonify({"message": "Tester details created successfully", "user_id": user_id}), 201

        elif request.method == "GET":
            try:
                tester_name = Tester_name.query.distinct(Tester_name.tester_name).all()
                return jsonify({"testers": [tester.to_dict() for tester in tester_name]}), 200
            except SQLAlchemyError as e:
                print(f"Database error: {str(e)}")
                return jsonify({"message": "An error occurred while retrieving tester data."}), 500
            except Exception as e:
                print(f"Unexpected error: {str(e)}")
                return jsonify({"message": "An unexpected error occurred."}), 500
            

# -------------------------------code by basil ---------------------------------





    @app.route("/project-base-billable/<int:id>", methods=["GET"])
    @jwt_required()
    def get_billabe_test(id):
        user_id = int(get_jwt_identity())

        try:
            # Get all testers for the specific project
            billable = Testers.query.filter_by(project_name_id=id).all()

            # Get the project name
            project_name = Project_name.query.filter_by(id=id).first()

            # Check if the project exists
            if not project_name:
                return jsonify({"message": f"Project with ID {id} not found"}), 404

            # Convert testers to dictionary format
            tester_info = [tester.to_dict() for tester in billable]

            return jsonify({
                "tester_info": tester_info,
                "project_name": project_name.project_name
            }), 200

        except Exception as e:
            # Catch any unexpected errors
            print(f"Error: {str(e)}")
            return jsonify({"message": "An unexpected error occurred."}), 500


    @app.route("/get_tester_details", methods=["POST"])
    @jwt_required()
    def get_tester_details():
        user_id = int(get_jwt_identity())
        data = request.get_json()

        # Check if the required data exists in the request
        billable_ids = data.get("ids", [])
        nonbillable_ids = data.get("nonbillable_ids", [])

        if not billable_ids and not nonbillable_ids:
            return jsonify({"message": "No tester IDs provided"}), 400

        billable_testers = []
        nonbillable_testers = []

        try:
            # Fetch billable testers from the database
            for tester_id in billable_ids:
                tester = Testers.query.filter_by(tester_name_id=tester_id).first()
                if tester:
                    billable_testers.append(tester)

            # Fetch non-billable testers from the database
            for tester_id in nonbillable_ids:
                tester = Testers.query.filter_by(tester_name_id=tester_id).first()
                if tester:
                    nonbillable_testers.append(tester)

            # Convert the testers to dictionaries
            billable_testers_data = [tester.to_dict() for tester in billable_testers]
            nonbillable_testers_data = [tester.to_dict() for tester in nonbillable_testers]

            return jsonify({
                "billable_testers": billable_testers_data,
                "nonbillable_testers": nonbillable_testers_data
            }), 200

        except Exception as e:
            # Catch any unexpected errors
            print(f"Error: {str(e)}")
            return jsonify({"message": "An unexpected error occurred."}), 500




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



