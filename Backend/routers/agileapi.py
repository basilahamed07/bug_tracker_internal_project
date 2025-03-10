#change in error handling
from flask import jsonify, request
from models import db, Project_name, Testers, AgileDetails, Users
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError,IntegrityError

def check_admin(user_id):
    # Check if the user is an admin
    user = Users.query.get(user_id)
    if user.role == 'admin':
        return True
    else:
        return False

def agile_details(app):
     
    # Get specific project agile details
    @app.route('/agile_details/<int:project_name_id>', methods=['GET'])
    @jwt_required()
    def get_agile_details_by_project(project_name_id):
        try:
            # Query the database for agile details by project name ID
            agile_details = AgileDetails.query.filter_by(project_name_id=project_name_id).all()

            # If no agile details are found
            if not agile_details:
                return jsonify({"message": "No Agile details found for this project"}), 404

            # Return the agile details as a JSON response
            return jsonify([detail.to_dict() for detail in agile_details]), 200

        except SQLAlchemyError as e:
            # If there is a database error
            print(f"Database error: {str(e)}")
            return jsonify({"message": "An error occurred while querying the database"}), 500

        except Exception as e:
            # Handle any other exceptions that might occur
            print(f"Error: {str(e)}")
            return jsonify({"message": "An unexpected error occurred"}), 500   

    #new code for bunch of records
    @app.route('/agile_details_post', methods=['POST'])
    @jwt_required()
    def create_agile_details():
        user_id = int(get_jwt_identity())
        data = request.get_json()

        if not data:
            return jsonify({"message": "No data provided"}), 400

        try:
            # Initialize a list to hold all the new AgileDetails objects
            new_agile_details = []

            # Loop through the data to process each entry
            for entry in data:
                # Validate that each entry contains required fields
                if not all(key in entry for key in ['scream_name', 'tester_name_id', 'total_experience',
                                                    'cpt_experience_start_date', 'total', 'skillset', 'project_name_id']):
                    return jsonify({"message": "Missing required fields in the input data"}), 400

                new_agile_detail = AgileDetails(
                    current_data=datetime.utcnow(),
                    scream_name=entry['scream_name'],
                    tester_name_id=entry['tester_name_id'],
                    total_experience=entry['total_experience'],
                    cpt_experience_start_date=entry['cpt_experience_start_date'],
                    total=entry['total'],
                    skillset=entry['skillset'],
                    user_id=user_id,
                    project_name_id=entry['project_name_id']
                )

                # Add each new AgileDetails object to the list
                new_agile_details.append(new_agile_detail)

            # Add all the new entries to the database in one transaction
            db.session.add_all(new_agile_details)
            db.session.commit()

            return jsonify({"message": "Agile details created successfully!", "count": len(new_agile_details)}), 201

        except IntegrityError as e:
            # If there is a database integrity error (e.g., foreign key constraint violation)
            db.session.rollback()
            print(f"Integrity error: {str(e)}")
            return jsonify({"message": "Integrity error: One or more entries violate database constraints."}), 400

        except SQLAlchemyError as e:
            # Catch other SQLAlchemy related errors
            db.session.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"message": "An error occurred while interacting with the database."}), 500

        except Exception as e:
            # General exception handling
            db.session.rollback()
            print(f"Error: {str(e)}")
            return jsonify({"message": "An unexpected error occurred."}), 500


# Update agile details (Admin access)
    @app.route('/agile_details_put/<int:id>', methods=['PUT'])
    @jwt_required()
    def update_agile_details(id):
        user_id = int(get_jwt_identity())  # Get the user_id from JWT token
        data = request.get_json()
    
        if not data:
            return jsonify({"message": "No data provided"}), 400
        
        if not check_admin(user_id):
            return jsonify({"message": "You do not have permission to perform this action."}), 403
    
        try:
            # Find the AgileDetails entry by id
            agile_detail = AgileDetails.query.get(id)
    
            # If the AgileDetails entry does not exist
            if not agile_detail:
                return jsonify({"error": "AgileDetails entry not found"}), 404
    
            old_scream_name = agile_detail.scream_name
    
            # Update the specific agile_detail with the provided data
            agile_detail.scream_name = data.get('scream_name', agile_detail.scream_name)
            agile_detail.tester_name_id = data.get('tester_name_id', agile_detail.tester_name_id)
            agile_detail.total_experience = data.get('total_experience', agile_detail.total_experience)
            agile_detail.cpt_experience_start_date = data.get('cpt_experience_start_date', agile_detail.cpt_experience_start_date)
            agile_detail.total = data.get('total', agile_detail.total)
            agile_detail.skillset = data.get('skillset', agile_detail.skillset)
            agile_detail.user_id = user_id  # Ensure user_id is not changed
            agile_detail.project_name_id = data.get('project_name_id', agile_detail.project_name_id)
    
            # If the scream_name is changed, update all entries with the old scream_name
            if old_scream_name != agile_detail.scream_name:
                # Update all records with the same old scream_name
                agile_details_to_update = AgileDetails.query.filter_by(scream_name=old_scream_name).all()
                for agile in agile_details_to_update:
                    agile.scream_name = agile_detail.scream_name  # Change all entries with the old scream_name to the new one
    
            # Commit the changes to the database
            db.session.commit()
    
            return jsonify({"message": "Agile details updated successfully!"}), 200
    
        except IntegrityError as e:
            # If there is a database integrity error (e.g., foreign key constraint violation)
            db.session.rollback()
            print(f"Integrity error: {str(e)}")
            return jsonify({"message": "Integrity error: One or more fields violate database constraints."}), 400
    
        except SQLAlchemyError as e:
            # Catch other SQLAlchemy related errors
            db.session.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"message": "An error occurred while interacting with the database."}), 500
    
        except Exception as e:
            # General exception handling
            db.session.rollback()
            print(f"Error: {str(e)}")
            return jsonify({"message": "An unexpected error occurred."}), 500


    # Delete agile details
    @app.route('/agile_details/<int:id>', methods=['DELETE'])
    @jwt_required()
    def delete_agile_detail(id):
        try:
            # Find the AgileDetails entry by id
            agile_detail = AgileDetails.query.get(id)

            # If the AgileDetails entry does not exist
            if not agile_detail:
                return jsonify({"message": "Agile detail not found"}), 404
            
            if check_admin(agile_detail.user_id):
                return jsonify({"message": "You do not have permission to perform this action."}), 403

            # Delete the AgileDetails record
            db.session.delete(agile_detail)
            db.session.commit()  # Commit the changes

            return jsonify({"message": "Agile detail deleted successfully!"}), 200

        except SQLAlchemyError as e:
            # If there is a database error
            db.session.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"message": "An error occurred while interacting with the database."}), 500

        except Exception as e:
            # Catch any other exceptions
            db.session.rollback()
            print(f"Error: {str(e)}")
            return jsonify({"message": "An unexpected error occurred."}), 500
