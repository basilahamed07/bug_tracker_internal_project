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

            # Update the story creation part
            created_stories = []
            for story in story_data:
                new_story = StoryDetails(
                    story_name=story['story_name'],
                    story_point=story['story_point'],
                    story_consumed=story.get('story_consumed'),  # Changed from Story_consumed and added .get()
                    status=story['status'],
                    completed_percentage=story['completed_percentage'],
                    manual_or_automation=story['manual_or_automation'],
                    tester_name_id=story['tester_id'],
                    sprint_detail_id=new_sprint.id,
                    target_date=story['target_date'],
                    actual_hour=story['actual_hour'],
                    estimated_hour=story['estimated_hour']
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
                story_detail.story_consumed = story['story_consumed']
                story_detail.status = story['status']
                story_detail.completed_percentage = story['completed_percentage']
                story_detail.manual_or_automation = story['manual_or_automation']
                story_detail.tester_name_id = story['tester_id']
                story_detail.sprint_detail_id = sprint.id  
                story_detail.target_date=story['target_date'],
                story_detail.actual_hour=story['actual_hour'],
                story_detail.estimated_hour=story['estimated_hour']
                # Ensure this is correctly linked to the updated sprint
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

    @app.route('/get_scrum_name/<int:scrum_id>', methods=['GET'])
    @jwt_required()
    def get_scrum_name(scrum_id):
        try:
            scrum = Scrum.query.get(scrum_id)  # Replace Scrum with your actual model name
            if not scrum:
                return jsonify({"message": "Scrum not found"}), 404
            return jsonify({"scream_name": scrum.scream_name}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

