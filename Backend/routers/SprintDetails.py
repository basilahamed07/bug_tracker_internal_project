from flask import jsonify, request
from models import db, Project_name, Testers, Tester_name, SprintDetails, StoryDetails
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

def parse_date(date_string):
    try:
        # Try to parse the full datetime (with time)
        return datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        # If the above fails, parse the date without time
        return datetime.strptime(date_string, "%Y-%m-%d")

def sprint_api(app):
    
    # SprintDetails API
    # Get all SprintDetails (requires authentication)
    @app.route('/sprint_details', methods=['GET'])
    @jwt_required()
    def get_sprint_details():
        sprint_details = SprintDetails.query.all()
        return jsonify([detail.to_dict() for detail in sprint_details])

    # Get sprint details by project name (requires authentication)
    # get by the 
    
    
    @app.route('/sprint_details/<int:agile_id>', methods=['GET'])
    @jwt_required()
    def get_sprint_details_by_project(agile_id):
        # Get the 'sprint_id' from query parameters (frontend should send this)
        sprint_id = request.args.get('sprint_id', type=int)  # Fetch sprint_id from query parameter
    
        # Query to filter SprintDetails by agile_id and sprint_id (if provided)
        if sprint_id:
            sprint_details = SprintDetails.query.filter_by(
                agile_id=agile_id, id=sprint_id).all()  # Add filtering by sprint_id here
        else:
            sprint_details = SprintDetails.query.filter_by(agile_id=agile_id).all()  # Query without sprint_id
    
        if not sprint_details:
            return jsonify({"message": "No Sprint details found for this project"}), 404
    
        # Prepare the data for response (including related StoryDetails)
        sprint_details_data = []
        for sprint in sprint_details:
            sprint_dict = sprint.to_dict()
    
            # Get the associated StoryDetails
            story_details = StoryDetails.query.filter_by(sprint_detail_id=sprint.id).all()
            story_details_data = [story.to_dict() for story in story_details]
            print(story_details_data)
    
            # Add story_details to the sprint data
            sprint_dict['story_details'] = story_details_data
            sprint_details_data.append(sprint_dict)
    
        return jsonify(sprint_details_data), 200

    @app.route('/sprint_details/<int:agile_id>/<string:pi_name>', methods=['GET'])
    @jwt_required()
    def get_sprint_details_by_pi(agile_id, pi_name):
        try:
            sprint_details = SprintDetails.query.filter_by(
                agile_id=agile_id, 
                PI_name=pi_name
            ).all()

            if not sprint_details:
                return jsonify({"message": "No Sprint details found for this PI"}), 404

            sprint_details_data = []
            for sprint in sprint_details:
                sprint_dict = sprint.to_dict()
                story_details = StoryDetails.query.filter_by(sprint_detail_id=sprint.id).all()
                story_details_data = [story.to_dict() for story in story_details]
                sprint_dict['story_details'] = story_details_data
                sprint_details_data.append(sprint_dict)

            return jsonify(sprint_details_data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500







#     # Create sprint details along with story details (requires authentication)
#     @app.route('/update_sprint_story', methods=['POST'])
#     @jwt_required()
#     def update_sprint_story():
#         """
#         payload

#         {
#   "sprint_details": {
#     "story_committed": 10,
#     "story_completed": 8,
#     "story_points_committed": 40,
#     "story_points_completed": 32,
#     "defect_open_critical": 2,
#     "defect_open_high": 3,
#     "defect_open_medium": 5,
#     "defect_open_low": 1,
#     "user_id": 1,
#     "project_name_id": 1,
#     "scrume_name": "Updated Agile Sprint 2025",
#     "start_date": "2025-01-01T12:00:00",
#     "end_date": "2025-02-01T12:00:00"
#   },
#   "story_details": {
#     "story_name": "Story 1",
#     "story_point": 5,
#     "status": "In Progress",
#     "completed_percentage": 60.0,
#     "manual_or_automation": "manual",
#     "tester_name_id": 1
#   }
# }


#         """
#         try:
#             # Get data from request
#             data = request.get_json()

#             # Check if data contains necessary details
#             if not data.get('sprint_details') or not data.get('story_details'):
#                 return jsonify({"message": "Missing sprint_details or story_details data"}), 400

#             sprint_data = data['sprint_details']
#             story_data = data['story_details']

#             # Handle StoryDetails creation
#             new_story = StoryDetails(
#                 story_name=story_data['story_name'],
#                 story_point=story_data['story_point'],
#                 status=story_data['status'],
#                 completed_percentage=story_data['completed_percentage'],
#                 manual_or_automation=story_data['manual_or_automation'],
#                 tester_name_id=story_data['tester_name_id']
#             )

#             # Add new StoryDetails to the database
#             db.session.add(new_story)
#             db.session.commit()  # Commit to get the ID assigned to the new story

#             # Handle SprintDetails creation
#             new_sprint = SprintDetails(
#                 story_committed=sprint_data['story_committed'],
#                 story_completed=sprint_data['story_completed'],
#                 story_points_committed=sprint_data['story_points_committed'],
#                 story_points_completed=sprint_data['story_points_completed'],
#                 defect_open_critical=sprint_data['defect_open_critical'],
#                 defect_open_high=sprint_data['defect_open_high'],
#                 defect_open_medium=sprint_data['defect_open_medium'],
#                 defect_open_low=sprint_data['defect_open_low'],
#                 story_details_id=new_story.id,  # Link to the new StoryDetails
#                 user_id=sprint_data['user_id'],
#                 project_name_id=sprint_data['project_name_id'],
#                 scrume_name=sprint_data['scrume_name'],  # Assuming you meant "scrume_name" instead of "agile_id"
#                 start_date=datetime.strptime(sprint_data['start_date'], "%Y-%m-%dT%H:%M:%S"),
#                 end_date=datetime.strptime(sprint_data['end_date'], "%Y-%m-%dT%H:%M:%S")
#             )

#             # Add new SprintDetails to the database
#             db.session.add(new_sprint)
#             db.session.commit()  # Commit changes

#             return jsonify({
#                 "message": "SprintDetails and StoryDetails created successfully",
#                 "sprint_details": new_sprint.to_dict(),
#                 "story_details": new_story.to_dict()
#             }), 200

#         except SQLAlchemyError as e:
#             db.session.rollback()  # Rollback if any error occurs
#             return jsonify({"message": str(e)}), 500


    @app.route('/update_sprint_story', methods=['POST'])
    @jwt_required()
    def update_sprint_story():
        try:
            # Get data from request
            data = request.get_json()
            user_id= int(get_jwt_identity())

            # Check if data contains necessary details
            if not data.get('sprint_details') or not data.get('story_details'):
                return jsonify({"message": "Missing sprint_details or story_details data"}), 400

            sprint_data = data['sprint_details']
            story_data = data['story_details']

            # check the pl are alrady have the 6 sprint
            if len(SprintDetails.query.filter_by(agile_id=sprint_data['scream_id'],PI_name=sprint_data['pi_name']).all()) >= 6:
                return jsonify({"message": "You can't add more than 6 sprint"}), 400
            # Handle SprintDetails creation first
            new_sprint = SprintDetails(
                story_committed=sprint_data['story_committed'],
                story_completed=sprint_data['story_completed'],
                story_points_committed=sprint_data['story_points_committed'],
                story_points_completed=sprint_data['story_points_completed'],
                defect_open_critical=sprint_data['defect_open_critical'],
                defect_open_high=sprint_data['defect_open_high'],
                defect_open_medium=sprint_data['defect_open_medium'],
                defect_open_low=sprint_data['defect_open_low'],
                user_id=user_id,
                project_name_id=sprint_data['project_name_id'],
                agile_id=sprint_data['scream_id'],
                start_date= parse_date(sprint_data['start_date']),
                end_date=parse_date(sprint_data['end_date']),
                sprint_name=sprint_data['sprint_name'],
                PI_name=sprint_data['pi_name']
            )

            # Add new SprintDetails to the database
            db.session.add(new_sprint)
            db.session.commit()  # Commit to get the ID assigned to the new sprint

            # Loop through each story_detail and create StoryDetails
            created_stories = []
            for story in story_data:
                new_story = StoryDetails(
                    story_name=story['story_name'],
                    story_point=story['story_point'],
                    status=story['status'],
                    completed_percentage=story['completed_percentage'],
                    manual_or_automation=story['manual_or_automation'],
                    tester_name_id=story['tester_id'],
                    sprint_detail_id=new_sprint.id  # Link the StoryDetails to the created SprintDetails
                )

                # Add new StoryDetails to the database
                db.session.add(new_story)
                db.session.commit()  # Commit each story individually

                # Add the created story to the list
                created_stories.append(new_story.to_dict())

            return jsonify({
                "message": "SprintDetails and StoryDetails created successfully",
                "sprint_details": new_sprint.to_dict(),
                "story_details": created_stories
            }), 200

        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback if any error occurs
            return jsonify({"message": str(e)}), 500
        
    @app.route('/get_pl_name/<int:id>', methods=['GET'])
    @jwt_required()
    def get_pl_name(id):
        try:
            sort_pi_name = SprintDetails.query.filter_by(agile_id=id).all()
            if not sort_pi_name:
                return jsonify({"message": "sprint_not found"}), 404
            
            #only get the pi_name and set 
            pi_name = []
            for i in sort_pi_name:
                pi_name.append(i.PI_name)
            final_pi = list(set(pi_name))
            return jsonify(final_pi), 200


        except SQLAlchemyError as e:
              # Rollback if any error occurs
            return jsonify({"message": str(e)}), 500

    @app.route('/update_sprint_story_put', methods=['PUT'])
    @jwt_required()
    def update_sprint_story_put():
        try:
            # Get data from request
            data = request.get_json()
            user_id = int(get_jwt_identity())
            # Check if data contains necessary details
            if not data.get('sprint_details') or not data.get('story_details'):
                return jsonify({"message": "Missing sprint_details or story_details data"}), 400
    
            sprint_data = data['sprint_details']
            story_data = data['story_details']

    
            # Retrieve the existing SprintDetails to update
            sprint = SprintDetails.query.get(sprint_data["sprint_id"])
            if not sprint:
                return jsonify({"message": "SprintDetails not found"}), 404
    
            # Update SprintDetails fields
            sprint.story_committed = sprint_data['story_committed']
            sprint.story_completed = sprint_data['story_completed']
            sprint.story_points_committed = sprint_data['story_points_committed']
            sprint.story_points_completed = sprint_data['story_points_completed']
            sprint.defect_open_critical = sprint_data['defect_open_critical']
            sprint.defect_open_high = sprint_data['defect_open_high']
            sprint.defect_open_medium = sprint_data['defect_open_medium']
            sprint.defect_open_low = sprint_data['defect_open_low']
            sprint.user_id = user_id
            sprint.project_name_id = sprint_data['project_name_id']
            sprint.sprint_name = sprint_data['sprint_name']  # Corrected field name from scrume_name
            sprint.start_date= parse_date(sprint_data['start_date']),
            sprint.end_date=parse_date(sprint_data['end_date']),
            sprint.PI_name=sprint_data['pi_name']
    
            # Commit the updated SprintDetails to the database
            db.session.commit()
    
            # Loop through each story_detail and update StoryDetails
            updated_stories = []
            for story in story_data:
                story_detail = StoryDetails.query.get(story['id'])
                if not story_detail:
                    return jsonify({"message": f"StoryDetails with id {story['id']} not found"}), 404
    
                # Update StoryDetails fields
                story_detail.story_name = story['story_name']
                story_detail.story_point = story['story_point']
                story_detail.status = story['status']
                story_detail.completed_percentage = story['completed_percentage']
                story_detail.manual_or_automation = story['manual_or_automation']
                story_detail.tester_name_id = story['tester_id']
                story_detail.sprint_detail_id = sprint.id  # Ensure this is correctly linked to the updated sprint
                # Commit the updated StoryDetails to the database
                db.session.commit()
    
                # Add the updated story to the list
                updated_stories.append(story_detail.to_dict())
    
            return jsonify({
                "message": "SprintDetails and StoryDetails updated successfully",
                "sprint_details": sprint.to_dict(),
                "story_details": updated_stories
            }), 200
    
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback if any error occurs
            return jsonify({"message": str(e)}), 500



    # # Update sprint detail (requires authentication)
    # @app.route('/update_sprint_and_story', methods=['PUT'])
    # def update_sprint_and_story():
    #     try:
    #         # Get the JSON data from the request
    #         data = request.get_json()

    #         # Retrieve the IDs from the request data
    #         sprint_id = data.get('sprint_id')
    #         story_id = data.get('story_id')

    #         # Validate the required fields
    #         if not sprint_id or not story_id:
    #             return jsonify({'error': 'Sprint ID and Story ID are required'}), 400

    #         # Fetch the SprintDetails and StoryDetails from the database
    #         sprint = SprintDetails.query.get(sprint_id)
    #         story_list = []
    #         for trash in story_id:
    #             story_list += StoryDetails.query.get(trash)

    #         # Update SprintDetails fields
    #         if 'story_committed' in data:
    #             sprint.story_committed = data['story_committed']
    #         if 'story_completed' in data:
    #             sprint.story_completed = data['story_completed']
    #         if 'story_points_committed' in data:
    #             sprint.story_points_committed = data['story_points_committed']
    #         if 'story_points_completed' in data:
    #             sprint.story_points_completed = data['story_points_completed']
    #         if 'defect_open_critical' in data:
    #             sprint.defect_open_critical = data['defect_open_critical']
    #         if 'defect_open_high' in data:
    #             sprint.defect_open_high = data['defect_open_high']
    #         if 'defect_open_medium' in data:
    #             sprint.defect_open_medium = data['defect_open_medium']
    #         if 'defect_open_low' in data:
    #             sprint.defect_open_low = data['defect_open_low']
    #         if 'start_date' in data:
    #             sprint.start_date = data['start_date']
    #         if 'end_date' in data:
    #             sprint.end_date = data['end_date']

    #         for trash in story_list:
    #             # Update StoryDetails fields
    #             if 'story_name' in data:
    #                 trash.story_name = data['story_name']
    #             if 'story_point' in data:
    #                 trash.story_point = data['story_point']
    #             if 'status' in data:
    #                 trash.status = data['status']
    #             if 'completed_percentage' in data:
    #                 trash.completed_percentage = data['completed_percentage']
    #             if 'manual_or_automation' in data:
    #                 trash.manual_or_automation = data['manual_or_automation']
    #             if 'tester_name_id' in data:
    #                 trash.tester_name_id = data['tester_name_id']

    #         # Commit the changes to the database
    #         db.session.commit()

    #         return jsonify({'message': 'Sprint and Story updated successfully'}), 200

    #     except Exception as e:
    #         db.session.rollback()  # Rollback if any exception occurs
    #         return jsonify({'error': str(e)}), 500

    # @app.route('/update_sprint_and_story', methods=['PUT'])
    # def update_sprint_and_story():
    #     try:
    #         # Get the JSON data from the request
    #         data = request.get_json()

    #         # Extract sprint and story details from the payload
    #         sprint_details = data.get('sprint_details')
    #         story_details_list = data.get('story_details')

    #         # Validate the required fields
    #         if not sprint_details or not story_details_list:
    #             return jsonify({'error': 'Sprint details and Story details are required'}), 400

    #         # Retrieve the SprintDetails object using the sprint_id from the payload
    #         sprint_id = sprint_details.get('sprint_id')
    #         if not sprint_id:
    #             return jsonify({'error': 'Sprint ID is required'}), 400

    #         sprint = SprintDetails.query.get(sprint_id)
    #         if not sprint:
    #             return jsonify({'error': 'Sprint not found'}), 404

    #         # Update SprintDetails fields if provided in the request
    #         for field, value in sprint_details.items():
    #             if hasattr(sprint, field):
    #                 setattr(sprint, field, value)

    #         # Update each StoryDetails in the list
    #         for story_data in story_details_list:
    #             story_id = story_data.get('story_id')
    #             story = StoryDetails.query.get(story_id)
    #             if not story:
    #                 return jsonify({'error': f'Story with ID {story_id} not found'}), 404

    #             # Update StoryDetails fields if provided in the request
    #             for field, value in story_data.items():
    #                 if hasattr(story, field):
    #                     setattr(story, field, value)

    #         # Commit the changes to the database
    #         db.session.commit()

    #         return jsonify({'message': 'Sprint and Story updated successfully'}), 200

    #     except Exception as e:
    #         db.session.rollback()  # Rollback if any exception occurs
    #         return jsonify({'error': str(e)}), 500


    # Delete sprint detail (requires authentication)
    @app.route('/sprint_details/<int:id>', methods=['DELETE'])
    @jwt_required()
    def delete_sprint_detail(id):
        sprint_detail = SprintDetails.query.get(id)
    
        if not sprint_detail:
            return jsonify({"message": "Sprint detail not found"}), 404
    
        try: 
            # Delete the related StoryDetails
            if sprint_detail.story_details_ref:
                for story in sprint_detail.story_details_ref:
                    db.session.delete(story)
    
            # Delete the SprintDetails record
            db.session.delete(sprint_detail)
            db.session.commit()
    
            return jsonify({"message": "Sprint and Story details deleted successfully!"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400


    @app.route('/story_details/<int:id>', methods=['DELETE'])
    @jwt_required()
    def delete_story_detail(id):
        story_detail = StoryDetails.query.get(id)

        if not story_detail:
            return jsonify({"message": "Story detail not found"}), 404

        try:
            # Get the associated SprintDetails based on the foreign key sprint_detail_id
            sprint_detail = SprintDetails.query.get(story_detail.sprint_detail_id)

            if not sprint_detail:
                return jsonify({"message": "Sprint detail not found"}), 404

            story_commited = 1
            story_completed = 0
            story_point = story_detail.story_point

            # Check if the status of the story is "done" to update completion stats
            if story_detail.status == "done":
                story_completed += 1  # Decrease committed story count

            # Update SprintDetails stats
            sprint_detail.story_committed -= story_commited
            sprint_detail.story_completed -= story_completed
            sprint_detail.story_points_committed -= story_point
            sprint_detail.story_points_completed -= story_completed

            # Delete the StoryDetails record
            db.session.delete(story_detail)

            # Commit the changes to the SprintDetails and StoryDetails
            db.session.commit()

            return jsonify({"message": "Story deleted successfully!"}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

