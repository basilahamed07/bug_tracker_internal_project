from flask import jsonify, request
from models import db, Project_name, Testers, AgileDetails
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
def agile_details(app):
     
    # Get specific project agile details
    @app.route('/agile_details/<int:project_name_id>', methods=['GET'])
    @jwt_required()
    def get_agile_details_by_project(project_name_id):
        agile_details = AgileDetails.query.filter_by(project_name_id=project_name_id).all()
        for trash in agile_details:
            print(trash.to_dict())

        if not agile_details:
            return jsonify({"message": "No Agile details found for this project"}), 404

        return jsonify([detail.to_dict() for detail in agile_details]), 200


    # old code
    # Post new agile details
    # @app.route('/agile_details_post', methods=['POST'])
    # @jwt_required()
    # def create_agile_detail():
    #     user_id = int(get_jwt_identity())
    #     data = request.get_json()

    #     try:
    #         new_agile_detail = AgileDetails(
    #             current_data=datetime.utcnow(),
    #             scream_name=data['scream_name'],
    #             tester_name_id=data['tester_name_id'],
    #             total_experience=data['total_experience'],
    #             cpt_experience_start_date=data['cpt_experience_start_date'],
    #             total=data['total'],
    #             skillset=data['skillset'],
    #             user_id=user_id,
    #             project_name_id=data['project_name_id']
    #         )

    #         db.session.add(new_agile_detail)
    #         db.session.commit()

    #         return jsonify({"message": "Agile detail created successfully!", "id": new_agile_detail.id}), 201
    #     except Exception as e:
    #         db.session.rollback()
    #         return jsonify({"error": str(e)}), 400
        

    #new code for bunch of records
    @app.route('/agile_details_post', methods=['POST'])
    @jwt_required()
    def create_agile_details():
        user_id = int(get_jwt_identity())
        data = request.get_json()
        print()

        try:
            # Initialize a list to hold all the new AgileDetails objects
            new_agile_details = []

            # Loop through the data to process each entry
            for entry in data:
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
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

    # for put based in the id of content
    # Update agile details (Admin access)
    @app.route('/agile_details_put/<int:id>', methods=['PUT'])
    @jwt_required()
    def update_agile_details(id):
        # Get the user_id from JWT token
        user_id = int(get_jwt_identity())
        data = request.get_json()
    
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
            agile_detail.user_id = user_id  # Make sure user_id is not changed
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
    
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400


        
    
    # # for bulk put the payload have the id    
    # @app.route('/agile_details_batch_update', methods=['PUT'])
    # @jwt_required()
    # def update_agile_details_batch():
    #     data = request.get_json()
    #     user_id = int(get_jwt_identity())

    #     try:
    #         # Iterate over the list of agile details to update
    #         for entry in data:
    #             agile_detail = AgileDetails.query.get(entry['id'])
    #             if not agile_detail:
    #                 return jsonify({"message": f"Agile detail with ID {entry['id']} not found"}), 404

    #             # Update fields if they are provided in the request
    #             agile_detail.scream_name = entry.get('scream_name', agile_detail.scream_name)
    #             agile_detail.tester_name_id = entry.get('tester_name_id', agile_detail.tester_name_id)
    #             agile_detail.total_experience = entry.get('total_experience', agile_detail.total_experience)
    #             agile_detail.cpt_experience_start_date = entry.get('cpt_experience_start_date', agile_detail.cpt_experience_start_date)
    #             agile_detail.total = entry.get('total', agile_detail.total)
    #             agile_detail.skillset = entry.get('skillset', agile_detail.skillset)
    #             agile_detail.user_id = user_id
    #             agile_detail.project_name_id = entry.get('project_name_id', agile_detail.project_name_id)

    #         # Commit all changes in one go
    #         db.session.commit()

    #         return jsonify({"message": "Agile details updated successfully!"}), 200
    #     except Exception as e:
    #         db.session.rollback()
    #         return jsonify({"error": str(e)}), 400


    # Delete agile details
    @app.route('/agile_details/<int:id>', methods=['DELETE'])
    @jwt_required()
    def delete_agile_detail(id):
        agile_detail = AgileDetails.query.get(id)

        if not agile_detail:
            return jsonify({"message": "Agile detail not found"}), 404

        try:
            db.session.delete(agile_detail)  # Delete the AgileDetails record
            db.session.commit()  # Commit the changes

            return jsonify({"message": "Agile detail deleted successfully!"}), 200
        except Exception as e:
            db.session.rollback()  # Rollback in case of any error
            return jsonify({"error": str(e)}), 400
